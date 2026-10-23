import {NextResponse} from 'next/server';
export async function POST(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:'Origin rejected'},{status:403});const res=NextResponse.json({ok:true});res.cookies.set('venu_access','',{path:'/',maxAge:0,httpOnly:true});return res;}
