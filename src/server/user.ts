"use server";
import { auth } from "../lib/auth"

const signIn = async () => {
      await auth.api.signInEmail( {
            body: {
                  email: "orcdev@test.com",
                  password: "password123",
            }
      } )
}

export const signUp = async () => {
      await auth.api.signUpEmail( {
            body: {
                  email: "orcdev@test.com",
                  password: "password123",
                  name: "Orc Dev"
            }
      } )
}