export function supabaseConfigured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)}
export const allowDemoFallback=process.env.ALLOW_DEMO_FALLBACK!=="false";
export const mlBase=(process.env.ML_SERVICE_URL||"http://127.0.0.1:8000").replace(/\/$/,"");
