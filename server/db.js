const mysql = require('mysql2');
require('dotenv').config(); // .env 파일 로드

// MariaDB 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST, // 환경 변수에서 가져오기
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, // 기본값 10
});

// DB 쿼리 실행 함수
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// 프로시저 호출 함수
const callProcedure = (procedureName, params) => {
    const placeholders = params.map(() => '?').join(', '); // 파라미터를 위한 placeholder 생성
    const sql = `CALL ${procedureName}(${placeholders})`; // 프로시저 호출 쿼리
    return query(sql, params); // query 함수 호출
};

module.exports = { query, callProcedure };
