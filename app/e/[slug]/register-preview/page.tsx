import {notFound} from 'next/navigation';
import {db} from '@/lib/supabase-server';
import RegistrationForm from '@/components/RegistrationForm';
export const dynamic='force-dynamic';
export default async function RegistrationPreview({params}:{params:{slug:string}}){
  let e:any; try{e=(await db(`events?slug=eq.${encodeURIComponent(params.slug)}&select=*`))?.[0]}catch{}
  if(!e)return notFound();
  return <main className="embedPage"><section className="embedForm"><span className="kicker">REGISTRATION</span><h1>{e.title}</h1><p>Complete the form below to reserve your place.</p><RegistrationForm event={e}/></section></main>
}
