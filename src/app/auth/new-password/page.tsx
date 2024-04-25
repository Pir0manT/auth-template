import { Suspense } from 'react'

import NewPasswordForm from '@/components/auth/new-password-form'

const Page = () => {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  )
}

export default Page
