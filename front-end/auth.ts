import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      googleId: string;
    } & DefaultSession["user"];
  }

  interface User {
    googleId?: string;
  }

  interface JWT {
    googleId?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_id: account.providerAccountId,
              name: user.name,
              email: user.email,
              avatar: user.image,
            }),
          },
        );
        const data = await res.json();
        token.googleId = data.user.google_id;
        token.backendToken = data.token;
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.user.googleId = token.googleId as string;
      return session;
    },

    // async signIn({ user, account }) {
    //   if (account?.provider === "google") {
    //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         google_id: account.providerAccountId,
    //         name: user.name,
    //         email: user.email,
    //         avatar: user.image,
    //       }),
    //     });
    //   }

    //   return true;
    // },
  },
});
