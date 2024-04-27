import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export const useCurrentUser = () => {
  const { data: session } = useSession()
  return useMemo(() => session?.user, [session])
}
