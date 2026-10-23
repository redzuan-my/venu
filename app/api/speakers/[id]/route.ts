import {requireAccess} from '@/lib/auth';
import {NextResponse} from 'next/server';import {db} from '@/lib/supabase-server';
export async function PATCH(req:Request,{params}:{params:{id:string}}){const denied=await requireAccess(req);if(denied)return denied;try{const b=await req.json();const r=await db(`speakers?id=eq.${params.id}`,{method:'PATCH',body:JSON.stringify(b)});return NextResponse.json(r?.[0]||r)}catch(e:any){return NextResponse.json({error:e.message},{status:500})}}
