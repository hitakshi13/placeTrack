import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      branch: string;
      cgpa: number;
      backlogs: number;
      graduationYear: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    [key: string]: unknown;
  }
}