import { User } from '@prisma/client'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import SettingsForm from '@/components/form-settings'

const Settings = async () => {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <SettingsForm />
    </SessionProvider>
  )
}

export default Settings
