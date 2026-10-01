import { create } from 'zustand'
import CryptoJS from 'crypto-js'

interface Credentials {
  homeserver: string
  userId: string
  accessToken: string
  deviceId: string
}

interface CredentialStore {
  credentials: Credentials | null
  saveCredentials: (creds: Credentials, masterPassword?: string) => Promise<void>
  loadCredentials: (masterPassword?: string) => Promise<Credentials | null>
  clearCredentials: () => Promise<void>
  exportBackup: (masterPassword?: string) => Promise<string>
  importBackup: (backup: string, masterPassword?: string) => Promise<boolean>
  hasStoredCredentials: () => Promise<boolean>
}

const STORAGE_KEY = 'matrix_client_credentials'
const MASTER_PASSWORD_HASH_KEY = 'matrix_client_master_password_hash'

export const useCredentialStore = create<CredentialStore>((set) => ({
  credentials: null,

  saveCredentials: async (creds: Credentials, masterPassword?: string) => {
    try {
      let dataToStore: string
      if (masterPassword) {
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(creds),
          masterPassword
        ).toString()
        dataToStore = encrypted
        
        // Store password hash for verification
        const passwordHash = CryptoJS.SHA256(masterPassword).toString()
        localStorage.setItem(MASTER_PASSWORD_HASH_KEY, passwordHash)
      } else {
        // Store unencrypted (less secure)
        dataToStore = JSON.stringify(creds)
      }
      
      localStorage.setItem(STORAGE_KEY, dataToStore)
      set({ credentials: creds })
    } catch (error) {
      console.error('Failed to save credentials:', error)
      throw new Error('Failed to save credentials')
    }
  },

  loadCredentials: async (masterPassword?: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      let creds: Credentials
      const passwordHashStored = localStorage.getItem(MASTER_PASSWORD_HASH_KEY)

      if (masterPassword && passwordHashStored) {
        // Verify password hash
        const passwordHash = CryptoJS.SHA256(masterPassword).toString()
        if (passwordHash !== passwordHashStored) {
          throw new Error('Invalid master password')
        }

        // Decrypt
        const decrypted = CryptoJS.AES.decrypt(stored, masterPassword).toString(
          CryptoJS.enc.Utf8
        )
        creds = JSON.parse(decrypted)
      } else if (!passwordHashStored) {
        // No encryption used
        creds = JSON.parse(stored)
      } else {
        throw new Error('Credentials are encrypted but no password provided')
      }

      set({ credentials: creds })
      return creds
    } catch (error) {
      console.error('Failed to load credentials:', error)
      return null
    }
  },

  clearCredentials: async () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(MASTER_PASSWORD_HASH_KEY)
    set({ credentials: null })
  },

  exportBackup: async (masterPassword?: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) throw new Error('No credentials to backup')

      const backup = {
        version: 1,
        timestamp: new Date().toISOString(),
        encrypted: !!masterPassword,
        data: stored,
      }

      return JSON.stringify(backup)
    } catch (error) {
      console.error('Failed to export backup:', error)
      throw new Error('Failed to create backup')
    }
  },

  importBackup: async (backup: string, masterPassword?: string) => {
    try {
      const parsed = JSON.parse(backup)
      
      if (parsed.version !== 1) {
        throw new Error('Unsupported backup version')
      }

      let decryptedData = parsed.data
      if (parsed.encrypted && masterPassword) {
        const decrypted = CryptoJS.AES.decrypt(
          parsed.data,
          masterPassword
        ).toString(CryptoJS.enc.Utf8)
        decryptedData = decrypted
      }

      // Verify it's valid credentials
      const creds = JSON.parse(decryptedData)
      if (!creds.homeserver || !creds.userId || !creds.accessToken) {
        throw new Error('Invalid credentials in backup')
      }

      // Restore to storage
      localStorage.setItem(STORAGE_KEY, parsed.data)
      if (parsed.encrypted) {
        const passwordHash = CryptoJS.SHA256(masterPassword!).toString()
        localStorage.setItem(MASTER_PASSWORD_HASH_KEY, passwordHash)
      }

      return true
    } catch (error) {
      console.error('Failed to import backup:', error)
      return false
    }
  },

  hasStoredCredentials: async () => {
    return !!localStorage.getItem(STORAGE_KEY)
  },
}))