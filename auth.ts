import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
   jwt({ token, user }) {
  if (user) {
    const u = user as unknown as Record<string, unknown>;
    token["id"] = u["id"] as string;
    token["role"] = u["role"] as string;
    token["branch"] = u["branch"] as string;
    token["cgpa"] = u["cgpa"] as number;
    token["backlogs"] = u["backlogs"] as number;
    token["graduationYear"] = u["graduationYear"] as number;
  }
  return token;
},

    session({ session, token }) {
      if (token && session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.id = token.id;
        u.role = token.role;
        u.branch = token.branch;
        u.cgpa = token.cgpa;
        u.backlogs = token.backlogs;
        u.graduationYear = token.graduationYear;
      }
      return session;
    },
  },                    // ← this closing brace was missing

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            role: true,
            branch: true,
            cgpa: true,
            backlogs: true,
            graduationYear: true,
            avatarUrl: true,
          },
        });

        if (!user) {
          await bcrypt.compare(
            password,
            "$2b$12$placeholder.hash.to.prevent.timing.attacks"
          );
          return null;
        }

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl ?? null,
          role: user.role,
          branch: user.branch,
          cgpa: user.cgpa,
          backlogs: user.backlogs,
          graduationYear: user.graduationYear,
        };
      },
    }),
  ],
});