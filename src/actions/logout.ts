'use server'

import { signOut } from '@/auth'

export const logout = async () => {
  // Здесь можно выполнить любые действия на сервере
  // при выходе пользователя
  await signOut()
}
