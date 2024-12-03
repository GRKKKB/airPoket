const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 파일 가져오기


// `/air-pollution` API 그냥 전체 값
router.get('/', async (req, res) => {
  try {
    // 프로시저 호출 또는 SELECT 쿼리 실행
    const sql = 'SELECT * FROM air_pollution_processed LIMIT 100';
    const results = await db.query(sql);

    // 결과 반환
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error retrieving data');
  }
});


// `/air-pollution/procedure` 서울,부산등 지역명과 날짜를 입력받아 각 측정소명의 점수등을 가져오기
// GetCombinedPollutionData 프로시저 호출 
router.get('/procedure', async (req, res) => {
    // 측정소명과 날짜
    const region = req.query.region?.trim(); // 입력된 지역 (빈 값일 수 있음)
    const date = req.query.date?.trim(); // 입력된 날짜 (빈 값일 수 있음)

    // 타입 및 입력값 확인
    if (region !== undefined && typeof region !== 'string') {
        return res.status(400).json({ error: true, message: 'Invalid region type. It must be a string.' });
    }
    if (date !== undefined && isNaN(new Date(date))) {
        return res.status(400).json({ error: true, message: 'Invalid date format. Use a valid date string.' });
    }

    // 날짜 포맷 검증 및 변환
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null;

    // 프로시저 호출
    try {
        const results = await db.callProcedure('GetCombinedPollutionData', [region || null, formattedDate]);

        // 결과 반환
        res.json(results);
    } catch (error) {
        console.error('Error calling procedure:', error);
        res.status(500).json({ error: true, message: 'Internal server error' });
    }

});


router.get('/procedure/serchOption', async (req, res) => {
  // 측정소명과 날짜
  const region = req.query.region?.trim(); // 입력된 지역 (빈 값일 수 있음)

  // 타입 및 입력값 확인
  if (region !== undefined && typeof region !== 'string') {
      return res.status(400).json({ error: true, message: 'Invalid region type. It must be a string.' });
  }


  // 프로시저 호출
  try {
      const results = await db.callProcedure('option_search_station_list', [region]);

      // 결과 반환
      res.json(results);
  } catch (error) {
      console.error('Error calling procedure:', error);
      res.status(500).json({ error: true, message: 'Internal server error' });
  }

});

// // 특정 프로시저 호출 라우트 예제 
// router.get('/call-procedure', async (req, res) => {
//     try {
//         const procedureName = 'your_procedure_name'; // 호출할 프로시저 이름
//         const params = [param1, param2]; // 프로시저에 전달할 파라미터 (없으면 빈 배열)

//         const results = await db.callProcedure(procedureName, params); // 프로시저 호출
//         res.json(results); // 결과 반환
//     } catch (error) {
//         console.error('Error calling procedure:', error);
//         res.status(500).send('Error calling procedure');
//     }
// });



module.exports = router;
