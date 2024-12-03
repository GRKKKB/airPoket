const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/realTime/metal` API 그냥 전체 값
router.get('/metal', async (req, res) => {
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

  
// `/realTime/air` API 그냥 전체 값
router.get('/air', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = `
      SELECT a.region,
             a.station_name,
             a.hour,
             a.weighted_score,
             a.pm25,
             a.PM19,
             a.SO2,
             a.CO,
             a.O3,
             a.NO2
      FROM day_air_pollution a
      `;
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });






module.exports = router;