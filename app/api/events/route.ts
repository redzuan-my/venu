import {NextResponse} from 'next/server';import {db} from '@/lib/supabase-server';
export async function GET(){try{return NextResponse.json(await db('events?select=*&order=created_at.desc'))}catch(e:any){return NextResponse.json({error:e.message},{status:500})}}
export async function POST(req:Request){try{const b=await req.json();const rows=await db('events',{method:'POST',body:JSON.stringify(b)});return NextResponse.json(rows?.[0]||rows,{status:201})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}}
