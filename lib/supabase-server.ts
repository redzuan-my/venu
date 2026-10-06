const base = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

export function supabaseConfig() {
  if (!base || !secret) {
    const missing = [!base && 'SUPABASE_URL', !secret && 'SUPABASE_SECRET_KEY'].filter(Boolean).join(', ');
    throw new Error(`Missing server environment variable${missing.includes(',') ? 's' : ''}: ${missing}`);
  }
  return { base, secret };
}

export async function db(path:string, init:RequestInit={}) {
  const {base,secret}=supabaseConfig();
  const res=await fetch(`${base}/rest/v1/${path}`,{
    ...init,
    // Supabase's new sb_secret_* keys are API keys, not JWTs.
    // They belong in `apikey`, NOT `Authorization: Bearer ...`.
    headers:{apikey:secret,'Content-Type':'application/json',Prefer:'return=representation',...(init.headers||{})},
    cache:'no-store'
  });
  if(!res.ok) {
    const detail = await res.text();
    throw new Error(`Supabase Data API ${res.status}: ${detail}`);
  }
  const text=await res.text(); return text?JSON.parse(text):null;
}
