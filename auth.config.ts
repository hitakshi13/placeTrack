import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      const isOnApiAuth = nextUrl.pathname.startsWith("/api/auth");
      const isOnApiPublic =
        nextUrl.pathname.startsWith("/api/register") ||
        nextUrl.pathname.startsWith("/api/health");

      if (isOnApiAuth || isOnApiPublic) return true;

      if (nextUrl.pathname === "/") {
        return Response.redirect(
          new URL(isLoggedIn ? "/dashboard" : "/login", nextUrl)
        );
      }

      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (!isLoggedIn && !isOnAuthPage) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },

  jwt({ token, user }) {
  if (user) {
    const u = user as unknown as Record<string, unknown>;
    token["id"] = u["id"] as string;
    token["role"] = u["role"];
    token["branch"] = u["branch"];
    token["cgpa"] = u["cgpa"];
    token["backlogs"] = u["backlogs"];
    token["graduationYear"] = u["graduationYear"];
  }
  return token;
},

    session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u["id"] = token["id"];
        u["role"] = token["role"];
        u["branch"] = token["branch"];
        u["cgpa"] = token["cgpa"];
        u["backlogs"] = token["backlogs"];
        u["graduationYear"] = token["graduationYear"];
      }
      return session;
    },
  },

  providers: [],
};
