import Image from "next/image";

import { signInWithGoogle } from "@/app/actions/auth-actions";
import GmailIcon from "@/public/gmail.svg";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <section className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🚀</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to your account
            </p>
          </div>

          {/* Login */}
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="
                flex w-full items-center justify-center gap-3
                rounded-xl border border-slate-300
                bg-white px-6 py-3
                text-sm font-medium text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2"
            >
              <Image src={GmailIcon} width={28} height={28} alt="" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
