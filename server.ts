import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'UniIT Desk - Cổng Thông Tin & Dịch Vụ Hỗ Trợ Kỹ Thuật CNTT',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
  });
});

// Serve static frontend assets
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all routes to index.html for React SPA Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[UniIT Desk] Server đang chạy tại http://localhost:${PORT}`);
  console.log(`[UniIT Desk] Sẵn sàng phục vụ mạng nội bộ trường.`);
});
