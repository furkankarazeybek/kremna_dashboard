// src/users/user.entity.ts
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
}