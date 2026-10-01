import { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import { useAppTheme } from './theme'
import { useAuthStore } from './stores/authStore'
import { useCredentialStore } from './stores/credentialStore'
import { useSettingsStore } from './stores/settingsStore'
import LoginPage from './components/LoginPage'
import MainLayout from './components/MainLayout'

function App() {
  const theme = useAppTheme()
  const { isLoggedIn, restoreSession } = useAuthStore()
  const { loadCredentials } = useCredentialStore()
  const { settings } = useSettingsStore()
  const [isInitializing, setIsInitializing] = useState(true)
  const [restoreError, setRestoreError] = useState<string | null>(null)

  useEffect(() => {
    const restoreStoredSession = async () => {
      try {
        const creds = await loadCredentials()
        if (creds) {
          await restoreSession(
            creds.homeserver,
            creds.userId,
            creds.accessToken,
            creds.deviceId
          )
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
        setRestoreError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setIsInitializing(false)
      }
    }

    restoreStoredSession()
  }, [loadCredentials, restoreSession])

  if (isInitializing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn ? (
        <MainLayout />
      ) : (
        <LoginPage error={restoreError} />
      )}
    </ThemeProvider>
  )
}

export default App