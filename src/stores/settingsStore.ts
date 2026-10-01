import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'normal' | 'large'
  messagePreviewLength: number
  showAvatars: boolean
  showTimestamps: boolean
  autoDownloadMedia: boolean
  enableEncryption: boolean
  syncTimeout: number
  notificationSound: boolean
  compactMode: boolean
  hideReadReceipts: boolean
  sortRoomsBy: 'activity' | 'alphabetical' | 'unread'
}

interface SettingsStore {
  settings: AppSettings
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (json: string) => boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  fontSize: 'normal',
  messagePreviewLength: 60,
  showAvatars: true,
  showTimestamps: true,
  autoDownloadMedia: true,
  enableEncryption: true,
  syncTimeout: 30000,
  notificationSound: true,
  compactMode: false,
  hideReadReceipts: false,
  sortRoomsBy: 'activity',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      updateSetting: <K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
      ) => {
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        }))
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS })
      },

      exportSettings: () => {
        const { settings } = get()
        return JSON.stringify(settings, null, 2)
      },

      importSettings: (json: string) => {
        try {
          const imported = JSON.parse(json)
          // Validate that imported settings have expected keys
          const keys = Object.keys(DEFAULT_SETTINGS)
          const isValid = keys.every((key) =>
            Object.prototype.hasOwnProperty.call(imported, key)
          )

          if (!isValid) {
            console.warn('Imported settings missing some fields')
            // Merge with defaults
            set({ settings: { ...DEFAULT_SETTINGS, ...imported } })
          } else {
            set({ settings: imported })
          }
          return true
        } catch (error) {
          console.error('Failed to import settings:', error)
          return false
        }
      },
    }),
    {
      name: 'matrix-client-settings',
      version: 1,
    }
  )
)