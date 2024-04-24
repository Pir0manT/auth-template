import { Suspense } from 'react'

import VerificationForm from '@/components/auth/verification-form'

const VerificationPage = () => {
  return (
    <Suspense>
      <VerificationForm />
    </Suspense>
  )
}

export default VerificationPage
