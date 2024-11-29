// 서버 구동 위치  이파일 위치로 터미널로 이동한뒤에  node server.js를 누르시면 서버가 돌아갑니다
const express = require('express');
const path = require('path');

const cors = require('cors');
const airPollutionRoutes = require('./routes/airPollution'); // API 라우트 가져오기

const app = express();
// 서버 포트번호 설정 3000번
const PORT = 3000;

// CORS 허용 추후 허용링크만 동작하게 설정
app.use(cors());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 연결
app.use('/air-pollution', airPollutionRoutes);


// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
