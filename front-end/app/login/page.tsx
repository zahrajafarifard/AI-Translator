import { signInWithGoogle } from "@/app/actions/auth-actions";

export default function LoginPage() {
  return (
    <form
      action={signInWithGoogle}
      className="flex flex-col w-full mx-auto justify-center items-center my-40"
    >
      <p className="text-4xl my-10">Login Page</p>
      <button type="submit" className="border rounded-md px-6 py-2 cursor-pointer">
        Sign in with Google
      </button>
    </form>
  );
}
