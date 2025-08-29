import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  FileDownload as ImportIcon
} from '@mui/icons-material';
import { useAppStore } from '../stores/appStore';
import type { ChatMessage } from '../types';

export const ChatPanel: React.FC = () => {
  const {
    chat,
    initializeChatSession,
    sendChatMessage,
    pollChatMessages,
    importData,
    addNotification
  } = useAppStore();

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize chat session when component mounts
    initializeChatSession();
  }, [initializeChatSession]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [chat.currentSession?.messages]);

  useEffect(() => {
    // Set up polling for new messages every 10 seconds
    const pollInterval = setInterval(() => {
      if (chat.currentSession && !chat.isLoading) {
        pollChatMessages();
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [chat.currentSession, chat.isLoading, pollChatMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || chat.isSending) return;

    try {
      await sendChatMessage(messageText.trim());
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
      addNotification({
        type: 'error',
        title: 'Chat Error',
        message: 'Failed to send message. Please try again.'
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleImportConfiguration = async (attachment: string) => {
    try {
      const configData = JSON.parse(attachment);
      importData(JSON.stringify(configData));
      addNotification({
        type: 'success',
        title: 'Configuration Imported',
        message: 'Bot response configuration has been loaded into the configurator.'
      });
    } catch (error) {
      console.error('Failed to import configuration:', error);
      addNotification({
        type: 'error',
        title: 'Import Error',
        message: 'Failed to import configuration from bot response.'
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.chatPartner === 'user';
    const hasAttachment = message.attachment && message.attachment.trim() !== '';

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5
          }}
        >
          {isUser ? <UserIcon color="primary" fontSize="small" /> : <BotIcon color="secondary" fontSize="small" />}
          <Typography variant="caption" color="textSecondary">
            {isUser ? 'You' : 'UC2 Assistant'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {formatTimestamp(message.timestamp)}
          </Typography>
        </Box>
        
        <Paper
          sx={{
            p: 2,
            maxWidth: '80%',
            bgcolor: isUser ? 'primary.light' : 'grey.100',
            color: isUser ? 'primary.contrastText' : 'text.primary'
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.message}
          </Typography>
          
          {hasAttachment && !isUser && (
            <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="Configuration Attached"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
                <Tooltip title="Import this configuration into the configurator">
                  <IconButton
                    size="small"
                    onClick={() => handleImportConfiguration(message.attachment!)}
                    color="secondary"
                  >
                    <ImportIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  if (chat.error) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ChatIcon />
          UC2 Chat Assistant
        </Typography>
        
        <Alert severity="error" sx={{ mb: 2 }}>
          {chat.error}
        </Alert>
        
        <Button
          variant="contained"
          onClick={initializeChatSession}
          disabled={chat.isLoading}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!chat.currentSession) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="textSecondary">
          Initializing chat session...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatIcon />
          UC2 Chat Assistant
        </Typography>
        
        <Tooltip title="Refresh messages">
          <IconButton
            onClick={pollChatMessages}
            disabled={chat.isLoading}
            size="small"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Session Info */}
      <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="textSecondary">
          Session: {chat.currentSession.sessionId}
        </Typography>
      </Paper>

      {/* Messages Area */}
      <Paper
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
          mb: 2,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider'
        }}
      >
        {chat.currentSession.messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <BotIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Welcome to UC2 Chat Assistant! Ask questions about your optical configuration, 
              request improvements, or get help with your setup.
            </Typography>
          </Box>
        ) : (
          <>
            {chat.currentSession.messages.map(renderMessage)}
            {chat.isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <BotIcon color="secondary" fontSize="small" />
                <CircularProgress size={16} />
                <Typography variant="caption" color="textSecondary">
                  UC2 Assistant is thinking...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your optical setup, request improvements, or get help..."
          multiline
          minRows={1}
          maxRows={3}
          fullWidth
          variant="outlined"
          size="small"
          disabled={chat.isSending}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!messageText.trim() || chat.isSending}
          variant="contained"
          sx={{ minWidth: 50 }}
        >
          {chat.isSending ? <CircularProgress size={20} /> : <SendIcon />}
        </Button>
      </Box>
    </Box>
  );
};