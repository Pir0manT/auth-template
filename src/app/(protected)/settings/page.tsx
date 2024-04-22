import { Button } from '@mui/material'

import { auth, signOut } from '@/auth'

const Settings = async () => {
  const session = await auth()
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          'use server'
          await signOut()
        }}
      >
        <Button type="submit">Выход</Button>
      </form>
    </div>
  )
}

export default Settings
