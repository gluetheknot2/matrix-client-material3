import { Box, List, ListItem, ListItemButton, ListItemText, Divider, Avatar, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useAuthStore } from '../stores/authStore'
import { useCredentialStore } from '../stores/credentialStore'
import { useState } from 'react'

interface SidebarProps {
  selectedRoom: string | null
  onSelectRoom: (room: string) => void
  onSettingsClick: () => void
}

export default function Sidebar({
  selectedRoom,
  onSelectRoom,
  onSettingsClick,
}: SidebarProps) {
  const { userId, displayName, avatarUrl, logout } = useAuthStore()
  const { clearCredentials } = useCredentialStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rooms = [
    { id: '!room1:matrix.org', name: 'General Chat', unread: 0 },
    { id: '!room2:matrix.org', name: 'Random', unread: 2 },
    { id: '!room3:matrix.org', name: 'Development', unread: 5 },
  ]

  const handleLogout = async () => {
    await logout()
    await clearCredentials()
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar
            src={avatarUrl || undefined}
            sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
          >
            {displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {displayName || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userId}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onSettingsClick(); handleMenuClose(); }}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {rooms.map((room) => (
          <ListItem
            key={room.id}
            disablePadding
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemButton
              selected={selectedRoom === room.id}
              onClick={() => onSelectRoom(room.id)}
              sx={{
                borderLeft: selectedRoom === room.id ? '4px solid' : '4px solid transparent',
                borderColor: selectedRoom === room.id ? 'primary.main' : 'transparent',
              }}
            >
              <ListItemText
                primary={room.name}
                secondary={room.unread > 0 ? `${room.unread} unread` : undefined}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: {
                    fontWeight: room.unread > 0 ? 600 : 400,
                  },
                }}
              />
              {room.unread > 0 && (
                <Box
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {room.unread}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}