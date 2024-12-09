   // 데이터를 가져오고 Chart.js를 이용해 차트를 생성
   fetch('http://localhost:3927/air-pollution') // Express.js API 호출
   .then(response => response.json())
   .then(data => {
       const labels = data.map(row => row.station_name);
       const pm25 = data.map(row => row.pm25);
       const pm10 = data.map(row => row.pm10);

       const ctx = document.getElementById('pollutionChart').getContext('2d');
       new Chart(ctx, {
           type: 'bar',
           data: {
               labels: labels,
               datasets: [
                   {
                       label: 'PM2.5',
                       data: pm25,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                       label: 'PM10',
                       data: pm10,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },
               ],
           },
       });
   });