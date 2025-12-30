// API Base URL Configuration
// Vite ortam değişkenlerinden alınır, yoksa localhost varsayılanı kullanılır

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const WIDGET_BASE_URL = import.meta.env.VITE_WIDGET_BASE_URL || 'http://localhost:5173';

export { API_BASE_URL, WIDGET_BASE_URL };
