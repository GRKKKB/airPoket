const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/aritestk.js API 정의
router.get('/', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = 'SELECT p.region, ROUND(AVG(e.mask_8h_in),4) AS AVG, RANK()OVER(ORDER BY AVG DESC) rank,p.timestamp FROM air_pollution_processed p  JOIN air_pollution_exposure e ON  p.id = e.exposure_id WHERE p.timestamp =CURDATE() GROUP BY p.region ORDER BY rank';
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });
module.exports = router;

