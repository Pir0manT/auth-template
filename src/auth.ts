import { AdapterUser } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { User } from '@prisma/client'
import NextAuth from 'next-auth'

import authConfig from '@/auth.config'
import { db } from '@/lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true
      return !(!user || !(user as User).emailVerified)
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          ...user,
          password: (user as User).password ? '***' : null,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user as AdapterUser

      return session
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      })
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  ...authConfig,
})
