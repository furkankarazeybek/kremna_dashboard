# ... (Dosyanın en başı aynı kalsın)

# ------------------------------
# 1. Frontend Build Aşaması
# ------------------------------
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend

COPY dashboard_frontend/package*.json ./
RUN npm install

COPY dashboard_frontend/ .

# DÜZELTME BURADA:
# Eskisi: ENV VITE_API_BASE_URL=/api/v1
# Yenisi (Bunu yaz):
ENV REACT_APP_API_BASE_URL=/api/v1

RUN npm run build

# ... (Geri kalan Backend ve Build kısımları aynı kalsın)