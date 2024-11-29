const mysql = require('mysql2');

// MariaDB 연결 설정
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'test',
    password: '1234',
    database: 'pythondb',
    waitForConnections: true,
    connectionLimit: 10
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


module.exports = { query ,callProcedure };