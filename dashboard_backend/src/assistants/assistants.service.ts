import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../config/supabase.config';
import { Assistant } from './assistant.entity';

@Injectable()
export class AssistantsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
  ) { }

  // Sadece o kullanıcının asistanlarını getir
  async findAll(userId: string): Promise<Assistant[]> {
    const { data, error } = await this.supabase
      .from('assistants')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data as Assistant[];
  }

  // Oluştururken userId'yi de kaydet
  async create(assistantData: Partial<Assistant>, userId: string): Promise<Assistant> {
    const { data, error } = await this.supabase
      .from('assistants')
      .insert([{ ...assistantData, user_id: userId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Assistant;
  }

  // Tekil getirmede de güvenlik kontrolü yapabilirsin (Opsiyonel ama iyi olur)
  async findOne(id: string): Promise<Assistant | null> {
    const { data, error } = await this.supabase
      .from('assistants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Assistant;
  }

  // Silme
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('assistants')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // Güncelleme
  async update(id: string, attrs: Partial<Assistant>): Promise<Assistant> {
    const { data, error } = await this.supabase
      .from('assistants')
      .update(attrs)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Assistant;
  }
}