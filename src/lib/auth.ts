import { createHash } from "node:crypto";
import { loginSchema } from "./validators";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      const current = token.id ? await prisma.user.findUnique({ where: { id: token.id as string } }) : null;
      if (!current) return null;
      const credentialTag = createHash("sha256").update(current.passwordHash ?? "").digest("hex");
      if (user) token.credentialTag = credentialTag;
      if (token.credentialTag !== credentialTag) return null;
      token.role = current.role;
      token.name = current.name;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string; role?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱" },
        password: { label: "密码" },
      },
      async authorize(credentials) {
        const input = loginSchema.safeParse(credentials);
        if (!input.success) return null;
        const { email, password } = input.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
