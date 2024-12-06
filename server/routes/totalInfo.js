const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/totalInfo` API 그냥 전체 값
router.get('/week-metal-avg-ratio', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = `SELECT element_name
                        , avg(measurement) as measurement
                    FROM week_avg_metal_pollution
                    GROUP BY element_name`;
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });



// `/totalInfo` API 그냥 전체 값
router.get('/week-metal-name', async (req, res) => {
    try {
      // 프로시저 호출 또는 SELECT 쿼리 실행
      const sql = `SELECT element_name
                    FROM metal_element`;
      const results = await db.query(sql);
  
      // 결과 반환
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error retrieving data');
    }
  });



// `/totalInfo` API 그냥 전체 값
router.get('/week-air-avg-ratio', async (req, res) => {
  try {
    // 프로시저 호출 또는 SELECT 쿼리 실행
    const sql = ` SELECT ROUND(avg(PM25),4) as PM25
                        ,ROUND(avg(PM10),4) as PM10
                        ,ROUND(avg(SO2),4) as SO2
                        ,ROUND(avg(CO),4) as CO
                        ,ROUND(avg(O3),4) as O3
                        ,ROUND(avg(NO2),4) as NO2
                  FROM week_avg_air_pollution`;
    const results = await db.query(sql);

    // 결과 반환
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error retrieving data');
  }
});

// `/totalInfo` API 그냥 전체 값
router.get('/week-air-avg-rank', async (req, res) => {
  try {
    // 프로시저 호출 또는 SELECT 쿼리 실행
    const sql = ` SELECT region
                        ,weighted_score
                        ,ROW_NUMBER() OVER (ORDER BY weighted_score DESC) AS "RANK"
                  FROM week_avg_air_pollution
                  GROUP BY region
                  ORDER BY RANK`;
    const results = await db.query(sql);

    // 결과 반환
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error retrieving data');
  }
});

























module.exports = router;
