const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const airPollutionRoutes = require('./routes/airPollution');
const realTimeRoutes = require('./routes/realTime');
const metalRoutes = require('./routes/metal');
const totalInfoRoutes = require('./routes/totalInfo');
const bom = require('./routes/bom');
const min = require('./routes/min');

const app = express();

// 서버 포트 설정
const HTTP_PORT = 3927;
const WS_PORT = 8080;

// HTTP 서버 생성
const httpServer = http.createServer(app);

// WebSocket 서버 생성
const wss = new WebSocket.Server({ port: WS_PORT });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('새 클라이언트 연결됨');

  ws.on('message', (data) => {
    console.log('받은 메시지:', data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('클라이언트 연결 종료됨');
  });

  ws.on('error', (error) => {
    console.error('WebSocket 에러:', error);
  });
});

// Middleware 설정
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net", // email.js CDN 허용
          "https://oapi.map.naver.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net", // 스타일 관련 CDN
          "https://stackpath.bootstrapcdn.com",
        ],
        imgSrc: ["'self'", "data:"], // 이미지 로드 허용
        connectSrc: [
          "'self'",
          "https://oapi.map.naver.com",
          "https://api.emailjs.com", // EmailJS API 호출 허용
          "https://naveropenapi.apigw.ntruss.com", // 네이버 OpenAPI 허용
          "ws://localhost:8080", // WebSocket 허용
        ],
      },
    },
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/metal', metalRoutes);
app.use('/realTime', realTimeRoutes);
app.use('/air-pollution', airPollutionRoutes);
app.use('/totalInfo', totalInfoRoutes);
app.use('/bom', bom);
app.use('/min', min);

const commentsRoutes = require('./routes/comments')(wss);
app.use('/comments', commentsRoutes);

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on http://localhost:${HTTP_PORT}`);
});

console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);
