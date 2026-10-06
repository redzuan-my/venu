const base = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

export function supabaseConfig() {
  if (!base || !secret) throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
  return { base, secret };
}

export async function db(path:string, init:RequestInit={}) {
  const {base,secret}=supabaseConfig();
  const res=await fetch(`${base}/rest/v1/${path}`,{
    ...init,
    headers:{apikey:secret,Authorization:`Bearer ${secret}`,'Content-Type':'application/json',Prefer:'return=representation',...(init.headers||{})},
    cache:'no-store'
  });
  if(!res.ok) throw new Error(await res.text());
  const text=await res.text(); return text?JSON.parse(text):null;
}
