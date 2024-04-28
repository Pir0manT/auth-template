'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useMediaQuery, useTheme } from '@mui/system'
import { User } from '@prisma/client'
import { useConfirm } from 'material-ui-confirm'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FcSettings } from 'react-icons/fc'
import { z } from 'zod'

import BackButton from '@/components/auth/back-button'
import Header from '@/components/centered-header'
import FormMessage from '@/components/form-message'
import { SeverityResult } from '@/lib/helpers'
import { settingSchema } from '@/schemas'
import { deleteAction } from '@/actions/delete'
import { logout } from '@/actions/logout'

interface SettingsFormProps {
  user: User
}
const SettingsForm = ({ user }: SettingsFormProps) => {
  const { update: updateUserSessionData } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof settingSchema>>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: user.name || undefined,
      image: user.image || undefined,
      role: user.role,
      email: user.email || undefined,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
    mode: 'onTouched',
  })
  const [isPending, startTransition] = useTransition()
  const [updateSettingsResult, setUpdateSettingsResult] =
    useState<SeverityResult>({
      severity: undefined,
      message: '',
    })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const confirmDlg = useConfirm()
  const isOAuthUser = user.password === null

  const onSubmit = (data: z.infer<typeof settingSchema>) => {
    setUpdateSettingsResult({ severity: undefined, message: '' })
    startTransition(async () => {})
  }

  const handleDeleteAccount = () => {
    confirmDlg({
      description: 'Вы уверены, что хотите удалить свою учетную запись?',
    })
      .then(() => {
        return deleteAction()
      })
      .then((result) => {
        if (result?.code === 'success') {
          return logout()
        }
      })
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        // Обработка любых ошибок, возникших во время подтверждения или удаления
        console.error('Произошла ошибка:', error)
      })
  }

  return (
    <Card sx={{ minWidth: { xs: '328px', sm: '600px' }, mt: { xs: 1, sm: 0 } }}>
      <Header
        component="legend"
        sx={{ paddingTop: 1, paddingBottom: 1 }}
        title={
          <Typography
            fontWeight="600"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: { xs: '24px', sm: '30px' },
            }}
          >
            <FcSettings style={{ marginRight: '8px' }} />
            Настройки
          </Typography>
        }
      />
      <CardHeader
        avatar={
          <Avatar
            src={user?.image || undefined}
            sx={{
              width: { xs: '80px', sm: '96px' },
              height: { xs: '80px', sm: '96px' },
              border: (theme) => `2px solid ${theme.palette.divider}`,
            }}
          />
        }
        title={user.name}
        titleTypographyProps={{
          fontSize: { xs: '16px', sm: '18px' },
          fontWeight: '500',
        }}
        subheader={`Набор прав: ${user.role}`}
        sx={{
          // borderTop: (theme) => `2px solid ${theme.palette.divider}`,
          // borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction={'column'} gap={2} mb={3}>
            <TextField
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              label="Имя пользователя"
              variant={isMobile ? 'standard' : 'outlined'}
              fullWidth
              disabled={isPending}
            />
            <TextField
              {...register('image')}
              error={!!errors.image}
              helperText={errors.image?.message}
              label="Ссылка на аватар"
              variant={isMobile ? 'standard' : 'outlined'}
              fullWidth
              disabled={isPending}
            />
            {!isOAuthUser && (
              <TextField
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                label="Email"
                variant={isMobile ? 'standard' : 'outlined'}
                fullWidth
                disabled={isPending}
              />
            )}
            <FormControl>
              <Controller
                name={'role'}
                control={control}
                defaultValue={user.role}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Набор прав"
                    disabled={isPending}
                    variant={isMobile ? 'standard' : 'outlined'}
                    error={!!errors.role}
                    fullWidth
                    helperText={errors.role?.message}
                  >
                    <MenuItem value="USER">Пользователь</MenuItem>
                    <MenuItem value="ADMIN">Администратор</MenuItem>
                  </TextField>
                )}
              />
            </FormControl>
            {!isOAuthUser && (
              <FormControl>
                <Controller
                  name={'isTwoFactorEnabled'}
                  control={control}
                  defaultValue={user.isTwoFactorEnabled}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          disabled={isPending}
                          checked={value}
                          onChange={onChange}
                        />
                      }
                      label={`Двухфакторная аутентификация ${value ? 'включена' : 'отключена'}`}
                      labelPlacement="start"
                      sx={{ justifyContent: 'space-between', ml: 0 }}
                    />
                  )}
                />
              </FormControl>
            )}
            <FormMessage
              message={updateSettingsResult.message}
              severity={updateSettingsResult.severity}
              onClose={() => {
                setUpdateSettingsResult({ severity: undefined, message: '' })
              }}
            />
          </Stack>
        </form>
      </CardContent>
      <CardActions
        sx={{
          pt: 0,
          justifyContent: isMobile ? 'space-between' : 'flex-end',
        }}
      >
        <Button
          size={isMobile ? 'small' : 'medium'}
          color="error"
          variant="outlined"
          onClick={handleDeleteAccount}
        >
          удалить
        </Button>
        {!isOAuthUser && (
          <Button
            size={isMobile ? 'small' : 'medium'}
            onClick={() => {
              router.push('/change-password')
            }}
            variant="outlined"
          >
            смена пароля
          </Button>
        )}
        <Button size={isMobile ? 'small' : 'medium'} variant="outlined">
          сохранить
        </Button>
      </CardActions>
      <CardContent sx={isMobile ? { '&:last-child': { pt: 0, pb: 1 } } : {}}>
        <BackButton label={'На главную'} href={'/'} disabled={isPending} />
      </CardContent>
    </Card>
  )
}

export default SettingsForm
