import { useState } from 'react'
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import Sidebar from './Sidebar'
import ChatView from './ChatView'
import SettingsPage from './SettingsPage'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          width: 300,
          display: { xs: 'none', sm: 'block' },
          borderRight: '1px solid',
          borderColor: 'divider',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Sidebar
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          onSettingsClick={() => setShowSettings(true)}
        />
      </Box>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <Box sx={{ width: 300, height: '100%' }}>
          <Sidebar
            selectedRoom={selectedRoom}
            onSelectRoom={(room) => {
              setSelectedRoom(room)
              setMobileOpen(false)
            }}
            onSettingsClick={() => {
              setShowSettings(true)
              setMobileOpen(false)
            }}
          />
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {selectedRoom ? `Chat: ${selectedRoom}` : 'Select a chat'}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {showSettings ? (
            <SettingsPage onClose={() => setShowSettings(false)} />
          ) : (
            <ChatView roomId={selectedRoom} />
          )}
        </Box>
      </Box>
    </Box>
  )
}