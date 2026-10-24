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
export async function POST(req:Request){const denied=await requireAccess(req,true);if(denied)return denied;try{const b=await req.json();const email=String(b.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['super_admin','organiser'].includes(b.role))return NextResponse.json({error:'Invalid email or role'},{status:400});const user=(await authUsers()).find((u:any)=>String(u.email||'').toLowerCase()===email);if(!user)return NextResponse.json({error:'Account not found. Invite the user through existing Sendr administration first.'},{status:404});const rows=await db('venu_user_access?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({user_id:user.id,role:b.role,active:true})});return NextResponse.json(rows?.[0]||{ok:true})}catch{return NextResponse.json({error:'Unable to grant access'},{status:503})}}
export async function PATCH(req:Request){const denied=await requireAccess(req,true);if(denied)return denied;try{const b=await req.json();if(!uuid.test(b.userId)||!['super_admin','organiser'].includes(b.role)||typeof b.active!=='boolean')return NextResponse.json({error:'Invalid update'},{status:400});const me=await currentUser();if(me?.id===b.userId)return NextResponse.json({error:'Cannot change your own access'},{status:400});const rows=await db(`venu_user_access?user_id=eq.${encodeURIComponent(b.userId)}`,{method:'PATCH',body:JSON.stringify({role:b.role,active:b.active})});return NextResponse.json(rows?.[0]||{ok:true})}catch{return NextResponse.json({error:'Unable to update access'},{status:503})}}
