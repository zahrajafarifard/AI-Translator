import Image from "next/image";
import { signOutUser } from "@/app/actions/auth-actions";

type HeaderProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Header({ name, email, image }: HeaderProps) {
  return (
    <header
      className="h-16 border-b px-6 flex items-center justify-between"
      role="banner"
    >
      <h1 className="text-xl font-semibold text-gray-400">Translator</h1>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-600">{name ?? "User"}</p>
          {email && <p className="text-sm text-gray-500">{email}</p>}
        </div>

        {image && (
          <Image
            src={image}
            alt={`${name ?? "User"} profile picture`}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
        )}

        <form action={signOutUser}>
          <button
            type="submit"
            aria-label="Sign out from your account"
            className="rounded-md px-4 py-2 text-sm font-medium border  border-amber-500  text-amber-600  hover:bg-amber-500
            hover:text-white focus:outline-none focus:ring-2  focus:ring-amber-400
            focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
