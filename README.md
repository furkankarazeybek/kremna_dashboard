
---
title: Kremna Dashboard
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# Kremna Chatbot Projesi - Dashboard

Bu proje, **Kremna AI** için geliştirilmiş kapsamlı bir yönetim paneli ve chatbot widget sistemidir.
NestJS (Backend), React (Frontend & Widget) ve PostgreSQL altyapısı üzerine inşa edilmiştir.

Proje 3 ana parçadan oluşur:
1.  **Dashboard Backend:** RESTful API ve WebSocket sunucusu.
2.  **Dashboard Frontend:** Asistanları ve sohbetleri yöneten admin paneli.
3.  **Chatbot Widget:** Web sitelerine gömülebilen canlı destek balonu.

## 🔗 Canlı Demo ve Linkler

Bu proje Hugging Face Spaces üzerinde canlı olarak çalışmaktadır.

* **Dashboard Paneli:** [https://furkankarazeybek-kremna-dashboard.hf.space](https://furkankarazeybek-kremna-dashboard.hf.space)
* **API Base URL:** `https://furkankarazeybek-kremna-dashboard.hf.space/api/v1`
* **Widget Embed Linki:** `https://furkankarazeybek-kremna-dashboard.hf.space/widget/embed.js`

## 🎥 Demo Video

[![Dashboard Demo](https://drive.google.com/thumbnail?id=1TtlLu_RY8yJmJ6n0BA87wG-hk-nAH6Qh)](https://drive.google.com/file/d/1TtlLu_RY8yJmJ6n0BA87wG-hk-nAH6Qh/view)

## 🚀 Kurulum ve Çalıştırma (Yerel Ortam)

Projeyi kendi bilgisayarınızda geliştirmek için aşağıdaki adımları izleyin.

### 1. Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL Veritabanı (Veya Supabase URL)

### 2. Kurulum

Proje "Monorepo" yapısındadır. Her alt proje için bağımlılıkları ayrı ayrı yüklemeniz gerekir.

```bash
# Ana dizindeyken:

# 1. Backend Kurulumu
cd dashboard_backend
npm install

# 2. Frontend Kurulumu
cd ../dashboard_frontend
npm install

# 3. Widget Kurulumu
cd ../chatbot_widget
npm install

```

### 3. Çevre Değişkenleri (.env)

Her klasörün içinde (`dashboard_backend`, `dashboard_frontend`, `chatbot_widget`) örnek `.env` dosyaları oluşturun.

**Backend (`dashboard_backend/.env`):**

```env
# Veritabanı Ayarları (Supabase veya Local)
DATABASE_URL="postgresql://user:password@host:5432/db_name"
SUPABASE_URL="[https://xyz.supabase.co](https://xyz.supabase.co)"
SUPABASE_SERVICE_ROLE_KEY="ey..."

# Uygulama Ayarları
PORT=3000
JWT_SECRET="gizli_anahtar_buraya"

# Yapay Zeka (Mistral vb.)
MISTRAL_API_KEY="mistral_api_key_buraya"

```

### 4. Başlatma

Geliştirme modunda tüm projeleri başlatmak için ayrı terminallerde şu komutları çalıştırın:

```bash
# Backend'i Başlat (Port: 3000)
cd dashboard_backend && npm run start:dev

# Frontend'i Başlat (Port: 3000 veya 3001)
cd dashboard_frontend && npm start

# Widget'ı Başlat (Port: 5173)
cd chatbot_widget && npm run dev

```

---

## 📡 API Endpoint Dokümantasyonu

Canlı ortamda tüm istekler şu adrese yapılmalıdır:
**`https://furkankarazeybek-kremna-dashboard.hf.space/api/v1`**

### 🔐 1. Kimlik Doğrulama (Auth)

*Kullanıcı kaydı ve girişi.*

| Metot | Endpoint | Açıklama | Örnek Body |
| --- | --- | --- | --- |
| **POST** | `/auth/register` | Yeni kullanıcı kaydı oluşturur. | `{ "email": "test@mail.com", "password": "123", "fullName": "Test User" }` |
| **POST** | `/auth/login` | Giriş yapar, JWT token döner. | `{ "email": "test@mail.com", "password": "123" }` |

### 🤖 2. Asistan Yönetimi (Assistants)

*Yapay zeka asistanlarını yapılandırma.*
**Header:** `Authorization: Bearer <ACCESS_TOKEN>`

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| **GET** | `/assistants` | Kullanıcının oluşturduğu tüm asistanları listeler. |
| **GET** | `/assistants/:id` | Tek bir asistanın detaylarını getirir. |
| **POST** | `/assistants` | Yeni bir asistan oluşturur. <br>

<br> Body: `{ "name": "Satış Botu", "model": "mistral-tiny", "instructions": "..." }` |
| **PATCH** | `/assistants/:id` | Asistan bilgilerini günceller. |
| **DELETE** | `/assistants/:id` | Asistanı siler. |

### 💬 3. Sohbet Geçmişi (Chats)

*Geçmiş konuşmaları görüntüleme ve yönetme.*
**Header:** `Authorization: Bearer <ACCESS_TOKEN>`

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| **GET** | `/chats` | Tüm sohbetlerin özet listesini getirir. |
| **GET** | `/chats/assistant/:assistantId` | Belirli bir asistana ait sohbetleri getirir. |
| **GET** | `/chats/:id` | Tek bir sohbetin mesaj detaylarını getirir. |
| **DELETE** | `/chats/:id` | Sohbeti siler. |

### 📊 4. Analitik (Analytics)

*Dashboard grafik verileri.*
**Header:** `Authorization: Bearer <ACCESS_TOKEN>`

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| **GET** | `/analytics` | Toplam mesaj sayısı, aktif asistanlar ve kullanım grafiklerini döner. |

---

## 🔌 WebSocket (Canlı Widget Bağlantısı)

Widget ile Backend arasındaki canlı iletişim **Socket.IO** üzerinden sağlanır.

* **Canlı URL:** `https://furkankarazeybek-kremna-dashboard.hf.space`
* **Path:** `/socket.io/`
* **Transports:** `["websocket"]`

### İstemci (Widget) -> Sunucu Eventleri

1. **`start_chat`**: Widget açıldığında sohbeti başlatır.
```json
{ "assistantId": "UUID..." }

```


2. **`send_message`**: Kullanıcı bir mesaj yazdığında gönderilir.
```json
{ "chatId": "UUID...", "content": "Merhaba, fiyatlarınız nedir?" }

```



### Sunucu -> İstemci (Widget) Eventleri

1. **`chat_started`**: Sohbet başarıyla oluşturulduğunda döner (Chat ID içerir).
2. **`new_message`**: Hem kullanıcının kendi mesajı hem de yapay zekanın cevabı bu event ile gelir.
```json
{
  "role": "user" | "assistant",
  "content": "Mesaj içeriği...",
  "createdAt": "..."
}

```



---

## 🛠 Kullanılan Teknolojiler

* **Backend:** NestJS, TypeORM, PostgreSQL, Supabase, JWT, Socket.IO
* **Frontend:** React, Context API, TailwindCSS
* **AI Model:** Mistral AI (veya OpenAI entegrasyonuna uygun yapı)
* **Deploy:** Docker, Hugging Face Spaces

