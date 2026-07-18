import Image from "next/image";
import { LogOut, Languages } from "lucide-react";
import { signOutUser } from "@/app/actions/auth-actions";

type HeaderProps = {
  name?: string |null;
  email?: string |null;
  image?: string |null;
};

export default function Header({
  name,
  email,
  image,
}: HeaderProps) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Languages size={20} />
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              AI Translator
            </h1>
            <p className="text-xs text-slate-500">
              English → Persian
            </p>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {name ?? "Guest"}
            </p>

            {email && (
              <p className="text-xs text-slate-500">
                {email}
              </p>
            )}
          </div>

          {image ? (
            <Image
              src={image}
              alt={`${name ?? "User"} profile`}
              width={42}
              height={42}
              priority
              className="rounded-full border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              {(name ?? "U").charAt(0).toUpperCase()}
            </div>
          )}

          <form action={signOutUser}>
            <button
              type="submit"
              aria-label="Sign out"
              className="
                flex items-center gap-2 rounded-lg
                border border-slate-300
                bg-white px-4 py-2
                text-sm font-medium text-slate-700
                transition
                hover:border-red-300
                hover:bg-red-50
                hover:text-red-600
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
                focus:ring-offset-2
              "
            >
              <LogOut size={16} />
              <span className="hidden md:inline">
                Sign out
              </span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}