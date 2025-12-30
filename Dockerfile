# ------------------------------
# 1. Widget Build Aşaması
# ------------------------------
FROM node:20-alpine as widget-build
WORKDIR /app/widget

# Paketleri yükle
COPY chatbot_widget/package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY chatbot_widget/ .

# Environment variables
ENV VITE_WIDGET_URL=https://furkankarazeybek-kremna-dashboard.hf.space/widget
ENV VITE_SOCKET_URL=https://furkankarazeybek-kremna-dashboard.hf.space

# Build al (vite build && node scripts/replace-widget-url.js)
# Vite config base'i package.json'daki script'ten veya vite.config.js'den ayarlamamız gerekebilir
# Ancak widget genelde embed edildiği için base path'i önemli olmayabilir. 
# Yine de /widget/ altında sunulacağı için base ayarı faydalı olabilir.
# Vite'de base ayarını komut satırından geçebiliriz.
RUN npm run build -- --base=/widget/


# ------------------------------
# 2. Frontend Build Aşaması
# ------------------------------
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

# Paketleri yükle
COPY dashboard_frontend/package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY dashboard_frontend/ .

ENV VITE_API_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space
ENV REACT_APP_API_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space
ENV REACT_APP_WIDGET_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space/widget

# Dashboard build
RUN npm run build


# ------------------------------
# 3. Backend Build Aşaması
# ------------------------------
FROM node:20-alpine as backend-build
WORKDIR /app/backend

# Backend paketleri
COPY dashboard_backend/package*.json ./
RUN npm install

# Backend kodları
COPY dashboard_backend/ .

# Backend'i derle
RUN npm run build


# ------------------------------
# 4. Birleştirme (Runtime) Aşaması
# ------------------------------
FROM node:20-alpine

WORKDIR /app

# Backend build dosyalarını al (node_modules ile birlikte gerekebilir veya production install)
# En temiz yöntem: backend package.json'ı kopyalayıp sadece production deps kurmak
COPY dashboard_backend/package*.json ./
RUN npm install --omit=dev

# Derlenmiş backend kodunu al
COPY --from=backend-build /app/backend/dist ./dist

# Frontend build dosyalarını public klasörüne taşı
COPY --from=frontend-build /app/frontend/build ./public

# Widget build dosyalarını public/widget klasörüne taşı
COPY --from=widget-build /app/widget/dist ./public/widget

# Ayarlar
ENV PORT=7860
EXPOSE 7860

# Başlat
CMD ["node", "dist/main"]