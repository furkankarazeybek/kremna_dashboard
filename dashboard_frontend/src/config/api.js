// dashboard_frontend/src/config/api.js

// Create React App'te 'import.meta.env' ÇALIŞMAZ.
// Bunun yerine 'process.env' kullanılır.
// Ayrıca değişkenlerin başına mutlaka 'REACT_APP_' gelmelidir.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const WIDGET_BASE_URL = process.env.REACT_APP_WIDGET_BASE_URL || 'http://localhost:5173';

export { API_BASE_URL, WIDGET_BASE_URL };