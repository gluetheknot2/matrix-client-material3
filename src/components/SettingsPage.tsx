import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Divider,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { useSettingsStore } from '../stores/settingsStore'
import { useCredentialStore } from '../stores/credentialStore'
import { useAuthStore } from '../stores/authStore'

interface SettingsPageProps {
  onClose: () => void
}

export default function SettingsPage({ onClose }: SettingsPageProps) {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useSettingsStore()
  const { exportBackup, importBackup, loadCredentials } = useCredentialStore()
  const { logout } = useAuthStore()
  const [backupPassword, setBackupPassword] = useState('')
  const [usePasswordForBackup, setUsePasswordForBackup] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [restorePassword, setRestorePassword] = useState('')
  const [usePasswordForRestore, setUsePasswordForRestore] = useState(false)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleCreateBackup = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const backup = await exportBackup(
        usePasswordForBackup ? backupPassword : undefined
      )

      const element = document.createElement('a')
      const file = new Blob([backup], { type: 'application/json' })
      element.href = URL.createObjectURL(file)
      element.download = `matrix-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      setMessage({ type: 'success', text: 'Backup downloaded successfully' })
      setShowPasswordDialog(false)
      setBackupPassword('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to create backup',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreBackup = async () => {
    if (!restoreFile) return

    setLoading(true)
    setMessage(null)

    try {
      const text = await restoreFile.text()
      const success = await importBackup(
        text,
        usePasswordForRestore ? restorePassword : undefined
      )

      if (success) {
        setMessage({ type: 'success', text: 'Backup restored successfully. Please refresh.' })
        setShowRestoreDialog(false)
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to restore backup' })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to restore backup',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', pb: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Theme
              </Typography>
              <Select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as any)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Font Size
              </Typography>
              <Select
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value as any)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.compactMode}
                  onChange={(e) => updateSetting('compactMode', e.target.checked)}
                />
              }
              label="Compact Mode"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Chat
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showAvatars}
                  onChange={(e) => updateSetting('showAvatars', e.target.checked)}
                />
              }
              label="Show Avatars"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.showTimestamps}
                  onChange={(e) => updateSetting('showTimestamps', e.target.checked)}
                />
              }
              label="Show Timestamps"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.hideReadReceipts}
                  onChange={(e) => updateSetting('hideReadReceipts', e.target.checked)}
                />
              }
              label="Hide Read Receipts"
            />

            <TextField
              type="number"
              label="Message Preview Length"
              value={settings.messagePreviewLength}
              onChange={(e) => updateSetting('messagePreviewLength', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 20, max: 200 } }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Media & Notifications
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoDownloadMedia}
                  onChange={(e) => updateSetting('autoDownloadMedia', e.target.checked)}
                />
              }
              label="Auto Download Media"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationSound}
                  onChange={(e) => updateSetting('notificationSound', e.target.checked)}
                />
              }
              label="Notification Sound"
            />

            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Sort Rooms By
              </Typography>
              <Select
                value={settings.sortRoomsBy}
                onChange={(e) => updateSetting('sortRoomsBy', e.target.value as any)}
              >
                <MenuItem value="activity">Activity</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Privacy & Security
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableEncryption}
                  onChange={(e) => updateSetting('enableEncryption', e.target.checked)}
                />
              }
              label="Enable End-to-End Encryption"
            />

            <TextField
              type="number"
              label="Sync Timeout (ms)"
              value={settings.syncTimeout}
              onChange={(e) => updateSetting('syncTimeout', parseInt(e.target.value))}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Backup & Restore
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Backup your credentials and settings for safe restoration later. You can optionally encrypt
            the backup with a password.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={() => setShowPasswordDialog(true)}
            >
              Create Backup
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={() => setShowRestoreDialog(true)}
            >
              Restore Backup
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Backups include your encrypted credentials and app settings.
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={2}>
        <Button variant="outlined" onClick={resetSettings} color="warning">
          Reset All Settings to Default
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            logout()
            onClose()
          }}
        >
          Logout
        </Button>
      </Stack>

      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Backup</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={usePasswordForBackup}
                onChange={(e) => setUsePasswordForBackup(e.target.checked)}
              />
            }
            label="Encrypt backup with password"
          />

          {usePasswordForBackup && (
            <TextField
              type="password"
              label="Backup Password"
              value={backupPassword}
              onChange={(e) => setBackupPassword(e.target.value)}
              fullWidth
              helperText="You will need this password to restore the backup"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBackup}
            variant="contained"
            disabled={loading || (usePasswordForBackup && !backupPassword)}
          >
            {loading ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showRestoreDialog}
        onClose={() => setShowRestoreDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Restore Backup</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="outlined" component="label" fullWidth>
            Select Backup File
            <input
              type="file"
              accept=".json"
              hidden
              onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
            />
          </Button>

          {restoreFile && (
            <Typography variant="body2" color="success.main">
              Selected: {restoreFile.name}
            </Typography>
          )}

          <FormControlLabel
            control={
              <Switch
                checked={usePasswordForRestore}
                onChange={(e) => setUsePasswordForRestore(e.target.checked)}
              />
            }
            label="Backup is password protected"
          />

          {usePasswordForRestore && (
            <TextField
              type="password"
              label="Backup Password"
              value={restorePassword}
              onChange={(e) => setRestorePassword(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestoreDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRestoreBackup}
            variant="contained"
            disabled={loading || !restoreFile}
          >
            {loading ? <CircularProgress size={20} /> : 'Restore'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}