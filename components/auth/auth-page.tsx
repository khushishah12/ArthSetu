import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { Brand } from "@/components/brand";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Brand />
        <div>
          <span>ARTHSETU AI · SECURE ACCESS</span>
          <h1>
            {mode === "login"
              ? "Continue your financial journey."
              : "Make your financial behaviour visible."}
          </h1>
          <p>
            Neon Auth and server-authorized Neon PostgreSQL queries keep saved
            assessments scoped to each user. Demo mode remains available
            without cloud configuration.
          </p>
        </div>
        <footer>
          Educational prototype · synthetic data · explainable outcomes
        </footer>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <span>{mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}</span>
          <h2>{mode === "login" ? "Sign in" : "Join ArthSetu"}</h2>
          <p>
            {mode === "login"
              ? "Access saved assessments and your private history."
              : "Create a secure identity for consent and assessment history."}
          </p>
          <AuthForm mode={mode} />
          <small>
            {mode === "login" ? (
              <>
                New to ArthSetu? <Link href="/signup">Create an account</Link>
              </>
            ) : (
              <>
                Already registered? <Link href="/login">Sign in</Link>
              </>
            )}
          </small>
        </div>
      </section>
    </main>
  );
}
