FROM node:20-alpine

WORKDIR /app
COPY dashboard_backend/package*.json ./
RUN npm install
COPY dashboard_backend/ .
RUN npm run build

ENV PORT=7860
EXPOSE 7860

CMD ["node", "dist/main"]