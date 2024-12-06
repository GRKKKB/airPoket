const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/bom` API 그냥 전체 값
router.get('/', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = ` 설렉트 문 넣기`;
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });






module.exports = router;
