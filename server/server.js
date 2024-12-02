const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const airPollutionRoutes = require('./routes/airPollution'); // API 라우트 가져오기

const app = express();

// 서버 포트번호 설정
const HTTP_PORT = 3000; // HTTP API와 정적 파일 제공용
const WS_PORT = 8080; // WebSocket 연결용

// HTTP 서버 생성
const server = http.createServer(app);

// 웹소켓 서버 생성 및 HTTP 서버에 통합
const wss = new WebSocket.Server({ server });


// 클라이언트 연결 시 이벤트
wss.on('connection', function connection(ws) {
    clients.add(ws);
    console.log('새 클라이언트 연결됨');
  
    // 메시지 수신 시 모든 클라이언트에 브로드캐스트
    ws.on('message', function incoming(data) {
      console.log('받은 메시지:', data);
  
      // 모든 클라이언트에 JSON 메시지 브로드캐스트
      clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data); // 받은 메시지 그대로 브로드캐스트
        }
      });
    });
  
    // 연결 종료 시 클라이언트 목록에서 제거
    ws.on('close', function() {
      clients.delete(ws);
      console.log('클라이언트 연결 종료됨');
    });
  
    // 에러 발생 시 처리
    ws.on('error', function(error) {
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
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'", `http://localhost:${HTTP_PORT}`],
            },
        },
    })
);
app.use(express.static(path.join(__dirname, 'public')));

// 난수 생성 (Nonce 설정)
app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(Date.now().toString()).toString('base64');
    next();
});

// 라우트 설정
app.use('/air-pollution', airPollutionRoutes);

// 서버 실행
server.listen(HTTP_PORT, () => {
    console.log(`HTTP/WS Server running on http://localhost:${HTTP_PORT}`);
});
