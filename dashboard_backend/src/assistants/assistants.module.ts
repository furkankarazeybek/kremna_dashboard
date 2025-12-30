// src/assistants/assistants.module.ts
import { Module } from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { AssistantsController } from './assistants.controller';

@Module({
  controllers: [AssistantsController],
  providers: [AssistantsService],
  exports: [AssistantsService], // Diğer modüller (Chats) kullanabilsin diye export ediyoruz
})
export class AssistantsModule { }