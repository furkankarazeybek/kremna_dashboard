# ------------------------------
# 1. AŞAMA: WIDGET (CHATBOT) DERLEME
# ------------------------------
FROM node:20-alpine as widget-build
WORKDIR /app/widget

# Widget paketlerini yükle
COPY chatbot_widget/package*.json ./
RUN npm install

# Widget kodlarını kopyala
COPY chatbot_widget/ .

# Ortam Değişkenleri
ENV VITE_API_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space/api/v1
ENV VITE_WIDGET_URL=https://furkankarazeybek-kremna-dashboard.hf.space/widget
ENV VITE_SOCKET_URL=https://furkankarazeybek-kremna-dashboard.hf.space

# --- KRİTİK DÜZELTME BURADA ---
# Eskisi: RUN npm run build -- --base=/widget/ (YANLIŞTI)
# Yenisi: Vite'ı ve scripti ayrı ayrı, doğru parametrelerle çalıştırıyoruz.
RUN npx vite build --base=/widget/ && node scripts/replace-widget-url.js

# ------------------------------
# 2. AŞAMA: DASHBOARD (FRONTEND) DERLEME
# ------------------------------
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

COPY dashboard_frontend/package*.json ./
RUN npm install

COPY dashboard_frontend/ .

# Dashboard ayarları
ENV REACT_APP_API_BASE_URL=
ENV REACT_APP_WIDGET_BASE_URL=https://furkankarazeybek-kremna-dashboard.hf.space/widget

# Dashboard'ı derle
RUN npm run build

# ------------------------------
# 3. AŞAMA: BACKEND VE BİRLEŞTİRME (FİNAL)
# ------------------------------
FROM node:20-alpine
WORKDIR /app

COPY dashboard_backend/package*.json ./
RUN npm install

COPY dashboard_backend/ .

RUN npm run build

# --- BÜYÜK BİRLEŞME ---
# 1. Dashboard dosyalarını ana sayfaya (public) koy
COPY --from=frontend-build /app/frontend/build ./public

# 2. Widget dosyalarını 'widget' klasörüne koy
COPY --from=widget-build /app/widget/dist ./public/widget

ENV PORT=7860
EXPOSE 7860

CMD ["node", "dist/main"]