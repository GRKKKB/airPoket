// server.js
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// MariaDB 연결 설정
const db = mysql.createConnection({
    host: '127.0.0.1', // DB 호스트 (로컬 서버)
    user: 'test', // 사용자명
    password: '1234', // 비밀번호
    database: 'pythondb' // DB 이름
});

// DB 연결 확인
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MariaDB!');
    }
});

// 특정 데이터 가져오기
app.get('/air-pollution', (req, res) => {
    const sql = 'SELECT * FROM air_pollution_processed LIMIT 100';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else {
            res.json(results); // 데이터를 JSON 형식으로 반환
        }
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
