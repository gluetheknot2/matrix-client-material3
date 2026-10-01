import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSettingsStore } from './stores/settingsStore'

// Material 3 Color Palette (Expressive variant)
const materialColors = {
  primary: '#6750a4', // Primary Purple
  onPrimary: '#ffffff',
  primaryContainer: '#eaddff',
  onPrimaryContainer: '#21005e',
  
  secondary: '#625b71', // Secondary Taupe
  onSecondary: '#ffffff',
  secondaryContainer: '#e8def8',
  onSecondaryContainer: '#1d192b',
  
  tertiary: '#7d5260', // Tertiary Pink
  onTertiary: '#ffffff',
  tertiaryContainer: '#ffd8e4',
  onTertiaryContainer: '#31111d',
  
  error: '#f2b8b5', // Error Red (expressive)
  onError: '#601410',
  errorContainer: '#8c1d18',
  onErrorContainer: '#f9dedc',
  
  background: '#fffbfe',
  onBackground: '#1c1b1f',
  surface: '#fffbfe',
  onSurface: '#1c1b1f',
  surfaceVariant: '#e7e0ec',
  onSurfaceVariant: '#49454e',
  
  outline: '#79747e',
  outlineVariant: '#cac4d0',
  scrim: '#000000',
}

// Dark variant colors
const darkMaterialColors = {
  primary: '#d0bcff',
  onPrimary: '#371e55',
  primaryContainer: '#4f378b',
  onPrimaryContainer: '#eaddff',
  
  secondary: '#ccc7d8',
  onSecondary: '#312033',
  secondaryContainer: '#4a454e',
  onSecondaryContainer: '#e8def8',
  
  tertiary: '#f0b8d8',
  onTertiary: '#492532',
  tertiaryContainer: '#633b48',
  onTertiaryContainer: '#ffd8e4',
  
  error: '#f2b8b5',
  onError: '#601410',
  errorContainer: '#8c1d18',
  onErrorContainer: '#f9dedc',
  
  background: '#1c1b1f',
  onBackground: '#e6e1e6',
  surface: '#1c1b1f',
  onSurface: '#e6e1e6',
  surfaceVariant: '#49454e',
  onSurfaceVariant: '#cac4d0',
  
  outline: '#938f99',
  outlineVariant: '#49454e',
  scrim: '#000000',
}

export const createAppTheme = (mode: 'light' | 'dark') => {
  const colors = mode === 'light' ? materialColors : darkMaterialColors

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: colors.primaryContainer,
        dark: colors.onPrimaryContainer,
        contrastText: colors.onPrimary,
      },
      secondary: {
        main: colors.secondary,
        light: colors.secondaryContainer,
        dark: colors.onSecondaryContainer,
        contrastText: colors.onSecondary,
      },
      error: {
        main: colors.error,
        light: colors.errorContainer,
        dark: colors.onErrorContainer,
        contrastText: colors.onError,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.onBackground,
        secondary: colors.onSurfaceVariant,
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.015625rem',
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 700,
        letterSpacing: '0rem',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '0rem',
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: '0.0125rem',
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0rem',
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 700,
        letterSpacing: '0.0125rem',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        letterSpacing: '0.03125rem',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '0.0125rem',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.0333rem',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 24,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  })
}

export const useAppTheme = () => {
  const { settings } = useSettingsStore()
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  const themeMode =
    settings.theme === 'auto'
      ? prefersDark
        ? 'dark'
        : 'light'
      : settings.theme

  return createAppTheme(themeMode)
}