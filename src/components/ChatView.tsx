import { Box, TextField, Button, Avatar, Typography, Paper, InputAdornment, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useSettingsStore } from '../stores/settingsStore'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: number
}

interface ChatViewProps {
  roomId: string | null
}

export default function ChatView({ roomId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const { displayName, userId } = useAuthStore()
  const { settings } = useSettingsStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (roomId) {
      setMessages([
        {
          id: '1',
          senderId: 'user1',
          senderName: 'Alice',
          content: 'Hey, how are you?',
          timestamp: Date.now() - 3600000,
        },
        {
          id: '2',
          senderId: userId || 'user2',
          senderName: displayName || 'You',
          content: 'Hi! I am doing great, thanks for asking.',
          timestamp: Date.now() - 1800000,
        },
        {
          id: '3',
          senderId: 'user1',
          senderName: 'Alice',
          content: 'Want to grab coffee later?',
          timestamp: Date.now() - 900000,
        },
      ])
    }
  }, [roomId, userId, displayName])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim() || !roomId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userId || 'unknown',
      senderName: displayName || 'User',
      content: input,
      timestamp: Date.now(),
    }

    setMessages([...messages, newMessage])
    setInput('')
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!roomId) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a room to start chatting
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'background.default',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent:
                message.senderId === userId ? 'flex-end' : 'flex-start',
            }}
          >
            {message.senderId !== userId && (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {message.senderName.charAt(0)}
              </Avatar>
            )}
            <Box
              sx={{
                maxWidth: '60%',
              }}
            >
              {message.senderId !== userId && (
                <Typography variant="caption" sx={{ px: 1, display: 'block' }}>
                  {message.senderName}
                </Typography>
              )}
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor:
                    message.senderId === userId
                      ? 'primary.main'
                      : 'surface',
                  color:
                    message.senderId === userId
                      ? 'primary.contrastText'
                      : 'text.primary',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {message.content}
                </Typography>
              </Paper>
              {settings.showTimestamps && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    display: 'block',
                    mt: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          placeholder="Type a message..."
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton size="small">
                  <AttachFileIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <EmojiEmotionsIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          sx={{ flexShrink: 0, alignSelf: 'flex-end' }}
        >
          Send
        </Button>
      </Paper>
    </Box>
  )
}