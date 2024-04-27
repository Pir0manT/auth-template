import { Button } from '@mui/material'

import { logout } from '@/actions/logout'
import { getCurrentUser } from '@/lib/auth'

const Settings = async () => {
  const user = await getCurrentUser()
  return (
    <div>
      {JSON.stringify(user)}
      <form
        action={async () => {
          'use server'
          await logout()
        }}
      >
        <Button type="submit">Выход</Button>
      </form>
    </div>
  )
}

export default Settings
