import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
export default async function ProductLayout({children}:{children:React.ReactNode}){const store=await cookies();const demo=store.get("arthsetu_demo")?.value==="1";let user:null|{email?:string|null;name?:string|null}=null;if(supabaseConfigured()){const supabase=await createClient();const{data}=await supabase!.auth.getUser();if(data.user)user={email:data.user.email,name:String(data.user.user_metadata?.full_name||"")};if(!user&&!demo)redirect("/login")}return <AppShell user={user} demo={demo||!supabaseConfigured()}>{children}</AppShell>}
