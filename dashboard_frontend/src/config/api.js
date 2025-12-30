// dashboard_frontend/src/config/api.js

// Create React App'te 'import.meta.env' ÇALIŞMAZ.
// Bunun yerine 'process.env' kullanılır.
// Ayrıca değişkenlerin başına mutlaka 'REACT_APP_' gelmelidir.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://furkankarazeybek-kremna-dashboard.hf.space';
const WIDGET_BASE_URL = process.env.REACT_APP_WIDGET_BASE_URL || 'https://furkankarazeybek-kremna-dashboard.hf.space/widget';

export { API_BASE_URL, WIDGET_BASE_URL };