'use client'

import { Logout, Settings } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'

import { logout } from '@/actions/logout'

interface UserMenuProps {
  user: User
}

const UserMenu = ({ user }: UserMenuProps) => {
  const menuItems = [
    { icon: <Settings fontSize="small" />, label: 'Настройки' },
    { icon: <Logout fontSize="small" />, label: 'Выход' },
  ]

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const router = useRouter()
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (label: string) => {
    switch (label) {
      case 'Настройки':
        {
          router.push('/settings')
        }
        break
      case 'Выход':
        {
          logout()
        }
        break
    }
  }
  return (
    <Fragment>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title={user.name}>
          <IconButton onClick={handleOpenMenu}>
            <Avatar
              src={user.image || undefined}
              sx={{ width: '48px', height: '48px' }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        slotProps={{
          paper: () => ({
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }),
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => handleMenuItemClick(item.label)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}

export default UserMenu
