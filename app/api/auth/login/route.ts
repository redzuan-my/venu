import {NextResponse} from 'next/server';
import {supabaseConfig,db} from '@/lib/supabase-server';
export async function POST(req:Request){
 try{
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});
 const {email,password}=await req.json();if(typeof email!=='string'||typeof password!=='string'||email.length>254||password.length>1000)return NextResponse.json({error:'Invalid credentials'},{status:400});
 const {base,secret}=supabaseConfig();const res=await fetch(`${base}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:secret,'Content-Type':'application/json'},body:JSON.stringify({email,password}),cache:'no-store'});
 if(!res.ok)return NextResponse.json({error:'Sign-in failed'},{status:401});
 const session=await res.json();const profile=await fetch(`${base}/auth/v1/user`,{headers:{apikey:secret,Authorization:`Bearer ${session.access_token}`},cache:'no-store'});if(!profile.ok)return NextResponse.json({error:'Sign-in failed'},{status:401});
 const user=await profile.json();const grants=await db(`venu_user_access?user_id=eq.${encodeURIComponent(user.id)}&active=eq.true&select=role`);
 if(!grants?.length)return NextResponse.json({error:'No VENU workspace access assigned'},{status:403});
 const response=NextResponse.json({ok:true,role:grants[0].role});response.cookies.set('venu_access',session.access_token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:Math.min(session.expires_in||3600,3600)});return response;
 }catch{return NextResponse.json({error:'Sign-in unavailable'},{status:503})}
}
