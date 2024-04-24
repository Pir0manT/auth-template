import Credentials from '@auth/core/providers/credentials'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Discord from 'next-auth/providers/discord'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Yandex from 'next-auth/providers/yandex'

import { getUserByEmail } from '@/data/user'
import { loginSchema } from '@/schemas'
interface CustomProviderContext {
  tokens: {
    access_token: string
  }
}
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    Yandex({
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
