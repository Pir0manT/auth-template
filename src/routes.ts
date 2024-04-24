/**
 * Массив путей, которые не требуют аутентификации
 * Эти пути будут доступны всем пользователям
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/verify']

/**
 * Массив путей, которые используются только для аутентификации
 * Эти пути будут перенаправлять пользователя на страницу по умолчанию DEFAULT_LOGIN_REDIRECT
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register', '/auth/error']

/**
 * Этот префикс для API путей аутентификации
 * Пути, начинающиеся с этого префикса используются для целей API аутентификации
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * Путь по умолчанию для перенаправления после аутентификации (на страницу настроек)
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'
