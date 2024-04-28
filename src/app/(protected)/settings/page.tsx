import { User } from '@prisma/client'

import SettingsForm from '@/components/form-settings'
import { getCurrentUser } from '@/lib/auth'

const Settings = async () => {
  const user = await getCurrentUser()
  return <SettingsForm user={user as User} />
}

export default Settings
