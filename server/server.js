require('dotenv').config();
const http = require('http');
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const webSocket = require('./webSocket'); // WebSocket 서버 모듈
const airPollutionRoutes = require('./routes/airPollution');
const realTimeRoutes = require('./routes/realTime');
const metalRoutes = require('./routes/metal');
const totalInfoRoutes = require('./routes/totalInfo');
const bom = require('./routes/bom');
const min = require('./routes/min');

// 환경 변수 확인
if (!process.env.NAVER_MAP_API_KEY) {
  console.error('Error: NAVER_MAP_API_KEY is not defined in .env file');
  process.exit(1); // 앱 종료
}

// 환경 변수 로드
const HTTP_PORT = process.env.HTTP_PORT || 3927;
const WS_PORT = process.env.WS_PORT || 8888;

// 배포 환경용 URL
const BASE_URL = process.env.BASE_URL || `http://localhost:${HTTP_PORT}`;
const WS_BASE_URL = process.env.WS_BASE_URL || `ws://localhost:${WS_PORT}`;

const app = express();
const httpServer = http.createServer(app);

// WebSocket 서버 실행
const wss = webSocket(WS_PORT);

// Middleware 설정
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // 필요 시 허용
          "https://cdn.jsdelivr.net",
          "https://oapi.map.naver.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // 필요 시 허용
          "https://cdn.jsdelivr.net",
          "https://stackpath.bootstrapcdn.com",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fastly.jsdelivr.net",
        ],
        connectSrc: [
          "'self'",
          "https://oapi.map.naver.com",
          "https://api.emailjs.com",
          WS_BASE_URL, // WebSocket 배포 URL
          BASE_URL, // API 배포 URL
          "https://naveropenapi.apigw.ntruss.com",
        ],
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API 엔드포인트: EmailJS 키 전달
app.get('/api/emailjs-config', (req, res) => {
  res.json({
    userId: process.env.EMAILJS_USER_ID,
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
  });
});

// 네이버 API 키값 전달 API
app.get('/api/naver-map-key', (req, res) => {
  const apiKey = process.env.NAVER_MAP_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key not set' });
  } else {
    res.json({ key: apiKey });
  }
});

// 기본 라우터
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 추가 라우터 설정
app.use('/metal', metalRoutes);
app.use('/realTime', realTimeRoutes);
app.use('/air-pollution', airPollutionRoutes);
app.use('/totalInfo', totalInfoRoutes);
app.use('/bom', bom);
app.use('/min', min);

const commentsRoutes = require('./routes/comments')(wss);
app.use('/comments', commentsRoutes);

// HTTP 서버 실행
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on ${BASE_URL}`);
  console.log(`WebSocket Server running on ${WS_BASE_URL}`);
});
