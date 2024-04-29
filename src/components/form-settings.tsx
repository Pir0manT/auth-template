'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@mui/lab'
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
import { User, UserRole } from '@prisma/client'
import { useConfirm } from 'material-ui-confirm'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FcSettings } from 'react-icons/fc'
import * as z from 'zod'

import { deleteAction } from '@/actions/delete'
import { logout } from '@/actions/logout'
import { updateSettingsAction } from '@/actions/settings'
import BackButton from '@/components/auth/back-button'
import Header from '@/components/centered-header'
import FormMessage from '@/components/form-message'
import { useCurrentUser } from '@/hooks/use-current-user'
import { setResult, SeverityResult } from '@/lib/helpers'
import { settingSchema } from '@/schemas'

const SettingsForm = () => {
  const { data, update: updateUserSessionData } = useSession()
  const user = useCurrentUser() as User | undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof settingSchema>>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: user?.name || undefined,
      image: user?.image || undefined,
      role: user?.role as UserRole,
      email: user?.email || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled,
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
  const isOAuthUser = user?.password === null

  const onSubmit = (values: z.infer<typeof settingSchema>) => {
    setUpdateSettingsResult({ severity: undefined, message: '' })
    startTransition(async () => {
      try {
        setUpdateSettingsResult({ severity: undefined, message: '' })
        const result = await updateSettingsAction(values)
        await updateUserSessionData(data)
        router.refresh()
        setResult(result, setUpdateSettingsResult)
      } catch (error) {
        setUpdateSettingsResult({
          severity: 'error',
          message: 'Что-то пошло не так!',
        })
      }
    })
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          title={user?.name}
          titleTypographyProps={{
            fontSize: { xs: '16px', sm: '18px' },
            fontWeight: '500',
          }}
          subheader={`Набор прав: ${user?.role}`}
          sx={{
            paddingTop: 1,
            paddingBottom: 1,
          }}
        />
        <CardContent>
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
                defaultValue={user?.role}
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
                  defaultValue={user?.isTwoFactorEnabled}
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
            disabled={isPending}
            type={'button'}
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
              disabled={isPending}
              type={'button'}
            >
              смена пароля
            </Button>
          )}
          <LoadingButton
            size={isMobile ? 'small' : 'medium'}
            variant="outlined"
            loading={isPending}
            type={'submit'}
            loadingPosition="start"
          >
            сохранить
          </LoadingButton>
        </CardActions>
        <CardContent sx={isMobile ? { '&:last-child': { pt: 0, pb: 1 } } : {}}>
          <BackButton label={'На главную'} href={'/'} disabled={isPending} />
        </CardContent>
      </form>
    </Card>
  )
}

export default SettingsForm
