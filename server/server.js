const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const airPollutionRoutes = require('./routes/airPollution'); // API 라우트 가져오기
const chartTestKmc = require('./routes/chartTestKmc');
const app = express();

// 서버 포트번호 설정
const HTTP_PORT = 3000; // HTTP API와 정적 파일 제공용
const WS_PORT = 8080; // WebSocket 연결용

// HTTP 서버 생성
const httpServer = http.createServer(app);

// 웹소켓 서버 생성 (독립적으로 8080 포트에서 실행)
const wss = new WebSocket.Server({ port: WS_PORT });

// WebSocket 클라이언트 관리용 Set
const clients = new Set();

// 클라이언트 연결 시 이벤트
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('새 클라이언트 연결됨');

    // 메시지 수신 시 모든 클라이언트에 브로드캐스트
    ws.on('message', (data) => {
        console.log('받은 메시지:', data);

        // 모든 클라이언트에 JSON 메시지 브로드캐스트
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data); // 받은 메시지 그대로 브로드캐스트
            }
        });
    });

    // 연결 종료 시 클라이언트 목록에서 제거
    ws.on('close', () => {
        clients.delete(ws);
        console.log('클라이언트 연결 종료됨');
    });

    // 에러 발생 시 처리
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
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'", `http://localhost:${HTTP_PORT}`],
            },
        },
    })
);

// JSON 요청 본문 파싱을 위한 미들웨어 추가
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));



// 라우트 설정
app.use('/air-pollution', airPollutionRoutes);

// WebSocket 서버를 `commentsRoutes`에 전달
const commentsRoutes = require('./routes/comments')(wss); // WebSocket 서버 전달
app.use('/comments', commentsRoutes); // `/comments` 경로로 댓글 라우트 연결

//chartTestKmc 연결 해보기

app.use('/chartTestKmc',chartTestKmc);

// HTTP 서버 실행
httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on http://localhost:${HTTP_PORT}`);
});

// WebSocket 서버 실행 확인
console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);
