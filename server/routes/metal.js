const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/metal` API 그냥 전체 값
router.get('/', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = 'SELECT city_name,HOUR,Pb,Ni,Mn,Zn,S FROM day_avg_metal_pollution2;';
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });






module.exports = router;
