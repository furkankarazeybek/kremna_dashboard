# 1. Node.js altyapısını kur
FROM node:18-alpine

# 2. Çalışma klasörü oluştur
WORKDIR /app

# 3. Sadece backend paket dosyalarını kopyala
COPY dashboard_backend/package*.json ./

# 4. Paketleri yükle
RUN npm install

# 5. Tüm backend kodlarını içeri kopyala
COPY dashboard_backend/ .

# 6. Uygulamayı derle (Build)
RUN npm run build

# 7. Hugging Face'in beklediği portu ayarla
ENV PORT=7860
EXPOSE 7860

# 8. Uygulamayı başlat
CMD ["node", "dist/main"]