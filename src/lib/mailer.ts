import { compile } from 'handlebars'
import nodemailer from 'nodemailer'

import { confirmationTemplate, resetPasswordTemplate } from '@/email-templates'

async function sendMail({
  from,
  to,
  subject,
  body,
}: {
  from: string
  to: string
  subject: string
  body: string
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASS } = process.env

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT as string),
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASS,
    },
  })

  try {
    await transport.verify()
    return await transport.sendMail({
      from: `${from} <${SMTP_EMAIL}>`,
      to,
      subject,
      html: body,
    })
  } catch (e) {
    console.log(SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASS)
    console.log(e)
    return null
  }
}

function compileTemplate(template: string, name: string, url: string) {
  return compile(template)({
    name,
    url,
  })
}

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
  const body = compileTemplate(confirmationTemplate, name, confirmLink)
  await sendMail({
    from: 'Auth Template App',
    to: email,
    subject: 'Подтверждение регистрации в Auth Template',
    body,
  })
}

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`
  const body = compileTemplate(resetPasswordTemplate, name, resetLink)
  await sendMail({
    from: 'Auth Template App',
    to: email,
    subject: 'Сброс пароля в Auth Template',
    body,
  })
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
  const body = `<p>Ваш код для входа в приложение Auth Template: <b>${token}</b></p>`
  await sendMail({
    from: 'Auth Template App',
    to: email,
    subject: 'Код для входа в приложение Auth Template',
    body,
  })
}
