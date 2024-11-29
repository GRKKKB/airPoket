const express = require('express');
const cors = require('cors');
const airPollutionRoutes = require('./routes/airPollution'); // API 라우트 가져오기

const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());

// 라우트 연결
app.use('/air-pollution', airPollutionRoutes);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
