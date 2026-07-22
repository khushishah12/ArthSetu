"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export function SignOutButton({demo}:{demo:boolean}){const router=useRouter();async function exit(){if(demo){await fetch("/api/demo-session",{method:"DELETE"})}else{try{await createClient().auth.signOut()}catch{}}router.push("/");router.refresh()}return <button className="shell-link signout" onClick={exit}><LogOut size={16}/><span>{demo?"Exit demo":"Sign out"}</span></button>}
