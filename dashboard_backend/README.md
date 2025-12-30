# nest_dashboard_api

NestJS backend API Supabase ile entegre chatbot dashboard sistemi.

## Gereksinimler

- Node.js (>=16)
- Supabase Projesi (https://supabase.com)

## Kurulum

1. Repoyu kopyalayın:
   ```bash
   cd dashboard_backend
   npm install
   ```

2. `.env` dosyasını oluşturun (`.env.example` dosyasını referans alın):
   ```bash
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # JWT
   JWT_SECRET=your-secret-key
   
   # Mistral AI
   MISTRAL_API_KEY=your-mistral-api-key
   ```

3. Supabase'de tabloları oluşturun (SQL Editor kullanarak):

   ```sql
   -- Users tablosu
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     username TEXT UNIQUE NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Assistants tablosu
   CREATE TABLE assistants (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     description TEXT,
     instructions TEXT,
     model TEXT DEFAULT 'gpt-3.5-turbo',
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Chats tablosu
   CREATE TABLE chats (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT,
     assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Messages tablosu
   CREATE TABLE messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
     content TEXT NOT NULL,
     chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- İndeksler (Performans için)
   CREATE INDEX idx_assistants_user_id ON assistants(user_id);
   CREATE INDEX idx_chats_assistant_id ON chats(assistant_id);
   CREATE INDEX idx_messages_chat_id ON messages(chat_id);
   CREATE INDEX idx_messages_created_at ON messages(created_at);
   ```

## Çalıştırma

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

API varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Postman Collection

Tüm endpoint'leri içeren Postman collection:
https://drive.google.com/file/d/1jLBlk9U1prXeUCivbZGX0xNSfBom91Uo/view?usp=sharing

## Teknolojiler

- **NestJS**: Backend framework
- **Supabase**: PostgreSQL database ve authentication
- **Socket.io**: Real-time chat
- **Mistral AI**: AI chatbot yanıtları
- **JWT**: Authentication

## API Endpoints

### Auth
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi

### Assistants
- `GET /assistants` - Asistanları listele
- `POST /assistants` - Yeni asistan oluştur
- `GET /assistants/:id` - Asistan detayı
- `PATCH /assistants/:id` - Asistan güncelle
- `DELETE /assistants/:id` - Asistan sil

### Chats
- `GET /chats` - Sohbetleri listele
- `GET /chats/:id` - Sohbet detayı
- `POST /chats` - Yeni sohbet başlat

### Analytics
- `GET /analytics/stats` - Dashboard istatistikleri

### WebSocket
- Namespace: `/chats`
- Events: `sendMessage`, `receiveMessage`
