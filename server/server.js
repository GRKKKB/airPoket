// 서버 구동 위치: 이 파일이 있는 디렉토리로 이동한 뒤에 "node server.js"를 실행하세요.
const express = require('express');
const path = require('path');
const cors = require('cors'); // CORS 설정을 위한 모듈
const helmet = require('helmet'); // Content Security Policy 설정을 위한 모듈
const airPollutionRoutes = require('./routes/airPollution'); // API 라우트 가져오기

const app = express();
// 서버 포트번호 설정 (기본값: 3000)
const PORT = 3000;

// CORS 설정: 현재는 모든 도메인을 허용 (운영 환경에서는 특정 도메인만 허용하도록 변경)
app.use(cors());

// Helmet을 사용하여 Content Security Policy(CSP) 설정
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"], // 현재 서버에서만 리소스 허용
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"], // 스크립트 허용: CDN 포함
                styleSrc: ["'self'", "'unsafe-inline'"], // 스타일 허용: 인라인 스타일 포함
                imgSrc: ["'self'", "data:"], // 이미지 허용
                connectSrc: ["'self'", "http://localhost:3000"], // API 요청 허용
            },
        },
    })
);

// 정적 파일 제공: public 폴더에 있는 파일을 클라이언트에 제공
app.use(express.static(path.join(__dirname, 'public')));

// 난수 생성: Nonce 설정을 위해 사용
app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(Date.now().toString()).toString('base64'); // 난수 생성
    next();
});

// 라우트 연결: /air-pollution 경로로 API 라우트를 연결
app.use('/air-pollution', airPollutionRoutes);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
