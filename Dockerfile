# ------------------------------
# 1. Frontend Build Aşaması
# ------------------------------
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

# Paketleri yükle
COPY dashboard_frontend/package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY dashboard_frontend/ .


ENV VITE_API_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space/api/v1
# Widget'ın kendi sunulduğu adres (Embed scripti için)
ENV VITE_WIDGET_URL=https://furkankarazeybek-kremna-dashboard.hf.space/widget
RUN npm run build -- --base=/widget/

ENV REACT_APP_API_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space
ENV REACT_APP_WIDGET_BASE_URL=https://furkankarazeybek-kremna-company.hf.space/widget
RUN npm run build

# ------------------------------
# 2. Backend Build Aşaması
# ------------------------------
FROM node:20-alpine
WORKDIR /app

# Backend paketleri
COPY dashboard_backend/package*.json ./
RUN npm install

# Backend kodları
COPY dashboard_backend/ .

# Backend'i derle
RUN npm run build

# ------------------------------
# 3. Birleştirme Aşaması
# ------------------------------
# Frontend build dosyalarını Backend'in sunacağı 'public' klasörüne taşı
COPY --from=frontend-build /app/frontend/build ./public

# Ayarlar
ENV PORT=7860
EXPOSE 7860

# Başlat
CMD ["node", "dist/main"]