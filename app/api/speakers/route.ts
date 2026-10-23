import {requireAccess} from '@/lib/auth';
import {NextResponse} from 'next/server';import {db} from '@/lib/supabase-server';
export async function GET(req:Request){const denied=await requireAccess(req);if(denied)return denied;try{return NextResponse.json(await db('speakers?select=*&order=name.asc'))}catch(e:any){return NextResponse.json({error:e.message},{status:500})}}
export async function POST(req:Request){const denied=await requireAccess(req);if(denied)return denied;try{const b=await req.json();const r=await db('speakers',{method:'POST',body:JSON.stringify(b)});return NextResponse.json(r?.[0]||r,{status:201})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}}
