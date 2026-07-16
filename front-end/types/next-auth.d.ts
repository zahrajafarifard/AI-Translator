import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;

    user: {
      googleId: string;
    } & DefaultSession["user"];
  }

  interface User {
    googleId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleId?: string;
    backendToken?: string;
  }
}
