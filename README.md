# Matrix Client - Material 3 Design

A modern Matrix client built with React, TypeScript, and Material Design 3 Expressive. Inspired by Element X with secure credential storage and backup/restore functionality.

## Features

### 🎨 Design
- **Material 3 Expressive**: Beautiful, modern UI with Material Design 3 color palette
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light/Auto Themes**: Automatic theme switching based on system preference
- **Customizable Appearance**: Adjustable font sizes and compact mode

### 💬 Messaging
- **Real-time Chat**: Connect to any Matrix homeserver
- **Room List**: Browse and switch between rooms quickly
- **Message Preview**: Configurable preview length
- **Timestamps & Read Receipts**: Optional display of metadata
- **Rich Message Support**: Text formatting, emoji support, file attachments

### 🔐 Security & Privacy
- **Secure Storage**: Store credentials locally with optional encryption
- **Master Password**: Encrypt stored credentials with a master password
- **End-to-End Encryption**: Support for Matrix E2E encryption
- **No Cloud Sync**: All data stays on your device

### 💾 Backup & Restore
- **Backup Export**: Download encrypted backups of your credentials and settings
- **Secure Restore**: Restore from backup files with password protection
- **Settings Export/Import**: Back up your preferences separately

### ⚙️ Settings
- **Chat Preferences**: Message preview, avatars, timestamps
- **Media Options**: Auto-download media, notification sounds
- **Organization**: Sort rooms by activity, alphabetical order, or unread count
- **Sync Configuration**: Adjustable sync timeout
- **Privacy Controls**: Read receipt visibility, encryption settings

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/gluetheknot2/matrix-client-material3.git
cd matrix-client-material3

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Login
1. Enter your Matrix homeserver URL (default: https://matrix.org)
2. Enter your username and password
3. Optionally set a master password to encrypt stored credentials

### Restore from Backup
1. Go to Settings → Backup & Restore → Restore Backup
2. Select your backup file
3. Enter the backup password if it was encrypted
4. Your credentials and settings will be restored

### Create a Backup
1. Go to Settings → Backup & Restore → Create Backup
2. Optionally encrypt with a password
3. Download the backup file
4. Store it safely (e.g., password manager, encrypted storage)

## Architecture

### State Management
- **Zustand**: Lightweight state management for auth, credentials, and settings
- **Local Storage**: Persistent storage for credentials and settings
- **Crypto-JS**: Client-side encryption for sensitive data

### Components
- `LoginPage`: Authentication and backup restoration
- `MainLayout`: Layout with sidebar and chat view
- `Sidebar`: Room list and user profile
- `ChatView`: Message display and input
- `SettingsPage`: All app settings and backup/restore

### Stores
- `authStore`: Authentication state and Matrix client
- `credentialStore`: Credential management with encryption
- `settingsStore`: App settings with persistence

## Security Considerations

### Encryption
- Credentials are encrypted using AES-256 with Crypto-JS
- Master password is hashed using SHA-256
- Backups can be password-protected

### Data Storage
- All data stored locally in browser storage (IndexedDB/localStorage)
- No cloud sync - no data leaves your device
- Credentials not sent anywhere except to your homeserver

### Best Practices
1. Use a strong master password if encrypting credentials
2. Store backups in a secure location
3. Never share your backup files
4. Use a trusted Matrix homeserver
5. Enable E2E encryption for sensitive conversations

## Configuration

### Homeserver Selection
The client supports any Matrix-compatible homeserver:
- `https://matrix.org` (Default, Matrix.org Foundation)
- `https://matrix.example.com` (Custom homeserver)
- Any other Matrix-compliant homeserver

### Supported Matrix Versions
- Matrix Client-Server API v3
- Matrix Core

## Troubleshooting

### Cannot Login
- Verify homeserver URL is correct
- Check username and password
- Ensure homeserver is accessible

### Backup Restore Failed
- Verify backup file is valid JSON
- Check backup password if encrypted
- Ensure backup format is compatible (v1)

### Settings Not Saving
- Check browser storage is not disabled
- Clear browser cache and try again
- Ensure adequate storage space

## Development

### Tech Stack
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Material-UI v6**: Component library
- **Zustand**: State management
- **Matrix JS SDK**: Matrix protocol
- **Vite**: Build tool
- **Crypto-JS**: Client-side encryption

### Project Structure
```
src/
├── components/        # React components
│   ├── LoginPage.tsx
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   ├── ChatView.tsx
│   └── SettingsPage.tsx
├── stores/           # Zustand stores
│   ├── authStore.ts
│   ├── credentialStore.ts
│   └── settingsStore.ts
├── theme.ts          # Material 3 theme
├── App.tsx           # Main component
└── main.tsx          # Entry point
```

## Future Enhancements

- [ ] Full Matrix API integration
- [ ] Encrypted file uploads
- [ ] Message reactions and replies
- [ ] User presence and typing indicators
- [ ] Room management (create, leave, invite)
- [ ] Direct messages
- [ ] Voice/video calling
- [ ] Progressive Web App (PWA)
- [ ] Biometric authentication

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## Support

For issues, feature requests, or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Include your environment details (OS, browser, etc.)

---

**Note**: This is a demonstration project showcasing Material Design 3 principles and Matrix client capabilities. For production use, consider using established clients like Element or Cinny.