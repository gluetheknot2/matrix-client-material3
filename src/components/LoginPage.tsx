import { useState } from 'react'
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useAuthStore } from '../stores/authStore'
import { useCredentialStore } from '../stores/credentialStore'

interface LoginPageProps {
  error?: string | null
}

export default function LoginPage({ error: initialError }: LoginPageProps) {
  const [tabValue, setTabValue] = useState(0)
  const [homeserver, setHomeserver] = useState('https://matrix.org')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [masterPassword, setMasterPassword] = useState('')
  const [useMasterPassword, setUseMasterPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError || '')
  const [backupFile, setBackupFile] = useState<File | null>(null)
  const [showBackupPassword, setShowBackupPassword] = useState(false)
  const [backupPassword, setBackupPassword] = useState('')
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)

  const { login } = useAuthStore()
  const { saveCredentials, importBackup, loadCredentials } = useCredentialStore()

  const handleLogin = async () => {
    if (!homeserver || !username || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await login(homeserver, username, password)

      const credentials = {
        homeserver,
        userId: username,
        accessToken: password,
        deviceId: 'device-id',
      }

      await saveCredentials(
        credentials,
        useMasterPassword ? masterPassword : undefined
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBackupFile(file)
      setRestoreDialogOpen(true)
    }
  }

  const handleRestoreBackup = async () => {
    if (!backupFile) return

    setLoading(true)
    setError('')

    try {
      const text = await backupFile.text()
      const success = await importBackup(
        text,
        showBackupPassword ? backupPassword : undefined
      )

      if (success) {
        const creds = await loadCredentials(
          showBackupPassword ? backupPassword : undefined
        )
        if (creds) {
          setRestoreDialogOpen(false)
          setBackupFile(null)
          location.reload()
        }
      } else {
        setError('Failed to restore backup')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6750a4 0%, #eaddff 100%)',
        padding: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 450, padding: 4 }}>
        <Typography
          variant="h3"
          sx={{ mb: 1, textAlign: 'center', color: 'primary.main' }}
        >
          Matrix Client
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}
        >
          Material 3 Design
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Restore Backup" />
        </Tabs>

        {tabValue === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Homeserver URL"
              value={homeserver}
              onChange={(e) => setHomeserver(e.target.value)}
              fullWidth
              placeholder="https://matrix.org"
            />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              placeholder="your_username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={useMasterPassword}
                  onChange={(e) => setUseMasterPassword(e.target.checked)}
                />
              }
              label="Encrypt with master password"
            />

            {useMasterPassword && (
              <TextField
                label="Master Password"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                fullWidth
                helperText="Used to encrypt stored credentials"
              />
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Select Backup File
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleFileSelect}
              />
            </Button>

            {backupFile && (
              <Typography variant="body2" color="success.main">
                Selected: {backupFile.name}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary">
              Upload a backup file created from Settings → Backup
            </Typography>
          </Box>
        )}
      </Card>

      <Dialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Restore Backup</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2">
            {backupFile?.name}
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={showBackupPassword}
                onChange={(e) => setShowBackupPassword(e.target.checked)}
              />
            }
            label="This backup is password protected"
          />

          {showBackupPassword && (
            <TextField
              label="Backup Password"
              type="password"
              value={backupPassword}
              onChange={(e) => setBackupPassword(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRestoreBackup}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Restore'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}