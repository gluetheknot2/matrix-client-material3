import { create } from 'zustand'
import * as matrix from 'matrix-js-sdk'

interface AuthState {
  client: matrix.MatrixClient | null
  isLoggedIn: boolean
  userId: string | null
  displayName: string | null
  avatarUrl: string | null
  login: (homeserver: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: (homeserver: string, userId: string, accessToken: string, deviceId: string) => Promise<void>
  setDisplayName: (name: string) => Promise<void>
  setAvatarUrl: (url: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  client: null,
  isLoggedIn: false,
  userId: null,
  displayName: null,
  avatarUrl: null,

  login: async (homeserver: string, username: string, password: string) => {
    try {
      const client = matrix.createClient({
        baseUrl: homeserver,
      })

      const response = await client.login(
        'm.login.password',
        { user: username, password }
      )

      client.setCredentials({
        userId: response.user_id,
        accessToken: response.access_token,
        deviceId: response.device_id,
      })

      await client.startClient()

      const profile = await client.getProfile(response.user_id)

      set({
        client,
        isLoggedIn: true,
        userId: response.user_id,
        displayName: profile.displayname || username,
        avatarUrl: profile.avatar_url || null,
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Failed to login')
    }
  },

  logout: async () => {
    const { client } = get()
    if (client) {
      try {
        await client.logout()
        client.stopClient()
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    set({
      client: null,
      isLoggedIn: false,
      userId: null,
      displayName: null,
      avatarUrl: null,
    })
  },

  restoreSession: async (
    homeserver: string,
    userId: string,
    accessToken: string,
    deviceId: string
  ) => {
    try {
      const client = matrix.createClient({
        baseUrl: homeserver,
        userId,
        accessToken,
        deviceId,
      })

      await client.startClient()

      const profile = await client.getProfile(userId)

      set({
        client,
        isLoggedIn: true,
        userId,
        displayName: profile.displayname || userId.split(':')[0],
        avatarUrl: profile.avatar_url || null,
      })
    } catch (error) {
      console.error('Failed to restore session:', error)
      throw new Error('Failed to restore session')
    }
  },

  setDisplayName: async (name: string) => {
    const { client, userId } = get()
    if (!client || !userId) throw new Error('Not logged in')

    try {
      await client.setDisplayName(name)
      set({ displayName: name })
    } catch (error) {
      console.error('Failed to set display name:', error)
      throw new Error('Failed to update display name')
    }
  },

  setAvatarUrl: async (url: string) => {
    const { client, userId } = get()
    if (!client || !userId) throw new Error('Not logged in')

    try {
      await client.setAvatarUrl(url)
      set({ avatarUrl: url })
    } catch (error) {
      console.error('Failed to set avatar:', error)
      throw new Error('Failed to update avatar')
    }
  },
}))