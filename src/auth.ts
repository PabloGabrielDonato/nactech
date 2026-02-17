import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (credentials?.email === "nacho@gmail.com" && credentials?.password === "password") {
          return { id: "1", name: "Nacho", email: "nacho@gmail.com" };
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
