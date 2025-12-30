import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../config/supabase.config';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
  ) { }

  async getStats(userId: string) {
    // 1. Sadece benim asistanlarımı say
    const { count: totalAssistants, error: assistantsError } = await this.supabase
      .from('assistants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (assistantsError) throw new Error(assistantsError.message);

    // 2. Benim asistanlarıma ait mesajları say
    const { count: totalMessages, error: messagesError } = await this.supabase
      .from('messages')
      .select('chat_id, chats!inner(assistant_id, assistants!inner(user_id))', { count: 'exact', head: true })
      .eq('chats.assistants.user_id', userId);

    // 3. Benim asistanlarıma ait sohbetler
    const { count: activeUsers, error: chatsError } = await this.supabase
      .from('chats')
      .select('assistant_id, assistants!inner(user_id)', { count: 'exact', head: true })
      .eq('assistants.user_id', userId);

    // GRAFİKLER (Son 7 gün trafik verisi)
    // Not: Supabase'de custom SQL fonksiyonları veya RPC kullanmak gerekebilir
    // Basitleştirilmiş versiyon - hepsini çekip JS'te gruplama
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: messagesData, error: trafficError } = await this.supabase
      .from('messages')
      .select('created_at, chat_id, chats!inner(assistant_id, assistants!inner(user_id))')
      .eq('chats.assistants.user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString());

    // Manuel gruplama (tarih bazlı)
    const trafficMap = new Map<string, number>();
    messagesData?.forEach((msg: any) => {
      const date = new Date(msg.created_at).toISOString().split('T')[0];
      trafficMap.set(date, (trafficMap.get(date) || 0) + 1);
    });

    const trafficData = Array.from(trafficMap.entries()).map(([date, count]) => ({
      date,
      count: count.toString()
    }));

    // Asistan kullanım istatistikleri
    const { data: assistantUsage, error: usageError } = await this.supabase
      .from('assistants')
      .select('name, chats(count)')
      .eq('user_id', userId);

    const assistantData = assistantUsage?.map((item: any) => ({
      name: item.name,
      value: item.chats?.length || 0
    })) || [];

    return {
      totalAssistants: totalAssistants || 0,
      totalMessages: totalMessages || 0,
      activeUsers: activeUsers || 0,
      trafficData,
      assistantData
    };
  }
}