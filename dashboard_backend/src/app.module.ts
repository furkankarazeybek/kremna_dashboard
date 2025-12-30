import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { AssistantsModule } from './assistants/assistants.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './config/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule, // Global Supabase modülü
    ChatsModule,
    AssistantsModule,
    AnalyticsModule,
    UsersModule,
    AuthModule
  ],

})
export class AppModule { }