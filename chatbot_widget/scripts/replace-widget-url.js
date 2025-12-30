// scripts/replace-widget-url.js
// Build sonrası embed.js içindeki __WIDGET_URL__ placeholder'ını değiştir

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Widget URL'ini environment variable'dan al
const WIDGET_URL = process.env.VITE_WIDGET_URL || 'huggingface.co/spaces/furkankarazeybek/kremna_dashboard/widget';

// dist/embed.js dosyasını oku
const embedPath = join(__dirname, '..', 'dist', 'embed.js');

try {
    let content = readFileSync(embedPath, 'utf-8');

    // Placeholder'ı gerçek URL ile değiştir
    content = content.replace(/__WIDGET_URL__/g, WIDGET_URL);

    // Güncellenen içeriği yaz
    writeFileSync(embedPath, content, 'utf-8');

    console.log(`✅ embed.js güncellendi: __WIDGET_URL__ -> ${WIDGET_URL}`);
} catch (error) {
    console.error('❌ embed.js güncellenirken hata oluştu:', error.message);
    process.exit(1);
}
