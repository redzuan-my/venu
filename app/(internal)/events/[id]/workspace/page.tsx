import {notFound} from 'next/navigation';import {db} from '@/lib/supabase-server';import WorkspaceClient from './WorkspaceClient';export const dynamic='force-dynamic';
export default async function Page({params}:{params:{id:string}}){let event:any;try{const r=await db(`events?id=eq.${params.id}&select=*`);event=r?.[0]}catch{}if(!event)return notFound();return <WorkspaceClient event={event}/>}
