import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth( {
      emailAndPassword: {
            enabled: true
      },
      socialProviders: {
            github: {
                  clientId: process.env.GITHUB_CLIENT_ID! as string,
                  clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
            },
      },
      plugins: [ nextCookies() ]
} );