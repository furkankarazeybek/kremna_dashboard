// src/chats/message.entity.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  chat_id: string;
  created_at?: Date;
}