import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Auth modülü kullanabilsin diye export ediyoruz
})
export class UsersModule { }