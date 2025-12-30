// src/chats/chat.entity.ts
import { Message } from './message.entity';
import { Assistant } from '../assistants/assistant.entity';

export interface Chat {
  id: string;
  title?: string;
  assistant_id: string;
  created_at?: Date;
  // Relations (manuel yüklenecek)
  messages?: Message[];
  assistant?: Assistant;
}