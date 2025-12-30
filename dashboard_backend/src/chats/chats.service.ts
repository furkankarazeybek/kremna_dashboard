// src/chats/chats.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../config/supabase.config';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import axios from 'axios';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
  ) { }

  // --- SQUAD 3 (WIDGET) İÇİN ---
  async findOrCreateChat(assistantId: string): Promise<Chat> {
    const { data, error } = await this.supabase
      .from('chats')
      .insert([{
        assistant_id: assistantId,
        title: 'Yeni Ziyaretçi Sohbeti'
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Chat;
  }

  async addMessage(chatId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        role,
        content
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Message;
  }

  // --- SQUAD 5 (AI CORE - MISTRAL) ---
  async generateAIResponse(chatId: string, userMessage: string): Promise<string> {
    // 1. Chat ve Asistan bilgilerini çek
    const { data: chat, error: chatError } = await this.supabase
      .from('chats')
      .select('*, assistants(*)')
      .eq('id', chatId)
      .single();

    if (chatError || !chat) {
      return "Hata: Asistan verisi bulunamadı.";
    }

    // 2. Asistanın "System Prompt"unu al
    const assistant = chat.assistants;
    const systemInstruction = assistant?.instructions || "Sen yardımsever bir asistansın.";

    try {
      // 3. Mistral API'ye İstek At
      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-tiny", // Hızlı ve ucuz model
          messages: [
            // SİSTEM MESAJI: Asistana kim olduğunu burada söylüyoruz
            { role: "system", content: systemInstruction },
            // KULLANICI MESAJI
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      // 4. Cevabı al ve döndür
      const aiText = response.data.choices[0].message.content;
      return aiText;

    } catch (error) {
      console.error("Mistral API Hatası:", error.response?.data || error.message);
      return "Üzgünüm, şu an beynimde (API) bir sorun var. Daha sonra tekrar dene.";
    }
  }

  // --- SQUAD 2 (DASHBOARD) İÇİN ---
  async findAll(): Promise<Chat[]> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*, messages(*), assistants(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Chat[];
  }

  async findByAssistant(assistantId: string): Promise<Chat[]> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*, messages(*)')
      .eq('assistant_id', assistantId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Chat[];
  }

  async findOne(id: string): Promise<Chat> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*, messages(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Sohbet bulunamadı');

    // Mesajları created_at'e göre sırala
    if (data.messages) {
      data.messages.sort((a: Message, b: Message) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    return data as Chat;
  }
}