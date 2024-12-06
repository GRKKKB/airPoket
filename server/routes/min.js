const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/min` API 그냥 전체 값
router.get('/mask', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = `SELECT 
                      da.region,
                      ROUND(AVG (da.mask_8h_in),4) AS mask_8h_in,
                      ROUND(AVG (da.no_mask_8h_in),4) AS no_mask_8h_in,
                      ROUND(AVG (da.mask_12h_in),4) AS mask_12h_in,
                      ROUND(AVG (da.no_mask_12h_in),4) AS no_mask_12h_in,
                      ROUND(AVG (da.mask_8h_out),4) AS mask_8h_out,
                      ROUND(AVG (da.no_mask_8h_out),4) AS no_mask_8h_out,
                      ROUND(AVG (da.mask_12h_out),4) AS mask_12h_out,
                      ROUND(AVG (da.no_mask_12h_out),4) AS no_mask_12h_out
                  FROM day_air_pollution da
                  GROUP BY da.region`;
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });






module.exports = router;
