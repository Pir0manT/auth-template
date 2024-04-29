import { AdapterUser } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { User } from '@prisma/client'
import NextAuth from 'next-auth'

import authConfig from '@/auth.config'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { db } from '@/lib/db'

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      if (!(user as User)?.emailVerified) return false

      if ((user as User).isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          (user as User).id
        )

        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        })
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      if (trigger === 'update' && token?.user) {
        const userId = (token.user as User).id
        const dbUser = await db.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (dbUser) {
          token.user = {
            ...dbUser,
            password: (dbUser as User).password ? '***' : null,
          }
        }
      }
      if (user) {
        token.user = {
          ...user,
          password: (user as User).password ? '***' : null,
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as AdapterUser
      }
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
