import {cookies,headers} from 'next/headers';
import {NextResponse} from 'next/server';
import {db,supabaseConfig} from '@/lib/supabase-server';
export type VenuRole='super_admin'|'organiser'|'contributor';
export async function currentUser(){
 const token=cookies().get('venu_access')?.value;
 if(!token)return null;
 const {base,secret}=supabaseConfig();
 const res=await fetch(`${base}/auth/v1/user`,{headers:{apikey:secret,Authorization:`Bearer ${token}`},cache:'no-store'});
 if(!res.ok)return null;
 const u=await res.json();if(!u.id)return null;
 const grants=await db(`venu_user_access?user_id=eq.${encodeURIComponent(u.id)}&active=eq.true&select=role`);
 const role=grants?.[0]?.role as VenuRole|undefined;
 return role?{id:u.id,email:u.email as string,role}:null;
}
export async function requireAccess(req:Request,adminOnly=false){
 const origin=req.headers.get('origin');
 if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'VENU sign-in required'},{status:401});
 if(adminOnly&&user.role!=='super_admin')return NextResponse.json({error:'Super Admin only'},{status:403});
 return null;
}
