   // 데이터를 가져오고 Chart.js를 이용해 차트를 생성
   fetch('http://localhost:3000/airtestk') // Express.js API 호출
   .then(response => response.json())
   .then(data => {
    const labels = data.map(row => row.region);
    const avg = data.map(row => row.avg);
    const rank = data.map(row => row.rank);
    

    const ctx = document.getElementById('airtestk').getContext('2d');
    new Chart(ctx, {
         type: 'bar',
         data: {
             labels: labels,
             datasets: [
                 {
                     label: 'avg',
                     data: avg,
                     backgroundColor: 'rgba(75, 192, 192, 0.5)',
                 },
                 {
                     label: 'rank',
                     data: rank,
                     backgroundColor: 'rgba(255, 99, 132, 0.5)',
                 },
             
             ],
         },
     });

   });