import {NextResponse} from 'next/server';import {requireAccess,currentUser} from '@/lib/auth';import {db,supabaseConfig} from '@/lib/supabase-server';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function authUsers(){
 const {base,secret}=supabaseConfig();const users:any[]=[];
 for(let page=1;page<=20;page++){
  const res=await fetch(`${base}/auth/v1/admin/users?page=${page}&per_page=200`,{headers:secret.startsWith('sb_secret_')?{apikey:secret}:{apikey:secret,Authorization:`Bearer ${secret}`},cache:'no-store'});
  if(!res.ok)throw Error(`Cannot retrieve account details (${res.status})`);
  const result=await res.json();const batch=result.users||[];users.push(...batch);if(batch.length<200)break;
 }
 return users;
}
export async function GET(req:Request){const denied=await requireAccess(req,true);if(denied)return denied;try{
 const [rows,users]=await Promise.all([db('venu_user_access?select=user_id,role,active,created_at&order=created_at.desc'),authUsers()]);
 const byId=new Map(users.map((u:any)=>[u.id,u]));
 return NextResponse.json(rows.map((r:any)=>{const u:any=byId.get(r.user_id);return {...r,email:u?.email||'Account unavailable',name:u?.user_metadata?.full_name||u?.user_metadata?.name||''}}));
 }catch(e){console.error('VENU user listing failure',e);return NextResponse.json({error:'Unable to load VENU users. Check Supabase Auth Admin API permissions.'},{status:503})}}
export async function POST(req:Request){
 const denied=await requireAccess(req,true);if(denied)return denied;
 try{
  const b=await req.json();const email=String(b.email||'').trim().toLowerCase();
  const vr=String(b.venuRole||b.role||'none');const sr=String(b.sendrRole||'none');
  const entities=Array.isArray(b.entities)?b.entities:[];
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['none','super_admin','organiser','contributor'].includes(vr)||!['none','super_admin','admin','member'].includes(sr)||entities.some((e:unknown)=>!['pp','eu','ip'].includes(String(e)))||(sr==='admin'||sr==='member')&&!entities.length||(vr==='none'&&sr==='none'))return NextResponse.json({error:'Invalid email or access selection'},{status:400});
  let account=(await authUsers()).find((u:any)=>String(u.email||'').toLowerCase()===email);
  let invited=false;
  if(!account){
   const {base,secret}=supabaseConfig();
   const redirect=process.env.VENU_INVITE_REDIRECT_URL||new URL('/login',req.url).toString();
   const r=await fetch(`${base}/auth/v1/invite?redirect_to=${encodeURIComponent(redirect)}`,{method:'POST',headers:{apikey:secret,'Content-Type':'application/json',...(!secret.startsWith('sb_secret_')?{Authorization:`Bearer ${secret}`}:{})},body:JSON.stringify({email}),cache:'no-store'});
   const d=await r.json().catch(()=>({}));if(!r.ok)return NextResponse.json({error:'Invitation failed: '+String(d.msg||d.message||d.error||r.status)},{status:502});
   account=d.user||d;invited=true;
  }
  if(!account?.id)return NextResponse.json({error:'Invitation may have been sent, but account ID was unavailable. Check Supabase before retrying.'},{status:502});
  const id=account.id;
  if(vr!=='none')await db('venu_user_access?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({user_id:id,role:vr,active:true})});
  else await db(`venu_user_access?user_id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({active:false})});
  if(sr==='super_admin'){
   await db('sendr_super_admins?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({user_id:id})});
  }else{
   await db(`sendr_super_admins?user_id=eq.${encodeURIComponent(id)}`,{method:'DELETE'});
   if(sr==='none')await db(`sendr_user_access?user_id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({active:false})});
   else{
    await db('sendr_user_access?on_conflict=user_id,entity_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(entities.map((entity_id:string)=>({user_id:id,entity_id,role:sr,active:true})))});
    const removed=['pp','eu','ip'].filter(e=>!entities.includes(e));
    if(removed.length)await db(`sendr_user_access?user_id=eq.${encodeURIComponent(id)}&entity_id=in.(${removed.join(',')})`,{method:'PATCH',body:JSON.stringify({active:false})});
   }
  }
  return NextResponse.json({ok:true,invited,userId:id});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to save shared access'},{status:503})}
}
export async function PATCH(req:Request){const denied=await requireAccess(req,true);if(denied)return denied;try{const b=await req.json();if(!uuid.test(b.userId)||!['super_admin','organiser','contributor'].includes(b.role)||typeof b.active!=='boolean')return NextResponse.json({error:'Invalid update'},{status:400});const me=await currentUser();if(me?.id===b.userId)return NextResponse.json({error:'Cannot change your own access'},{status:400});const rows=await db(`venu_user_access?user_id=eq.${encodeURIComponent(b.userId)}`,{method:'PATCH',body:JSON.stringify({role:b.role,active:b.active})});return NextResponse.json(rows?.[0]||{ok:true})}catch{return NextResponse.json({error:'Unable to update access'},{status:503})}}
