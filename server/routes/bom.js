const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// ` http://localhost:3000/bom` API 그냥 전체 값
router.get('/', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = `SELECT region, weighted_score
                   FROM week_avg_air_pollution
                   WHERE region IN ('Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan')
                   ORDER BY CASE region
                    WHEN 'Seoul' THEN 1
                    WHEN 'Busan' THEN 2
                    WHEN 'Ulsan' THEN 3
                    WHEN 'Daegu' THEN 4
                    WHEN 'Daejeon' THEN 5
                    WHEN 'Incheon' THEN 6
                    WHEN 'Gwangju' THEN 7
                   END`;
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });






module.exports = router;
