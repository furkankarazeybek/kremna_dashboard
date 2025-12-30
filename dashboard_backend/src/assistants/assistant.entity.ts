// src/assistants/assistant.entity.ts
export interface Assistant {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  model?: string;
  user_id?: string;
  created_at?: Date;
}