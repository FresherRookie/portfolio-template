import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { sendPasswordResetEmail } from "@/lib/email";

import { ac, adminRole } from "@/lib/auth-permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,

    resetPasswordTokenExpiresIn: 60 * 60,

    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
      });
    },
  },

  plugins: [
    admin({
      ac,
      roles: { admin: adminRole },
      defaultRole: "admin",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],

  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGIN
      ? [process.env.BETTER_AUTH_TRUSTED_ORIGIN]
      : []),
  ],
});
