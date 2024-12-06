   // 데이터를 가져오고 Chart.js를 이용해 차트를 생성
   fetch('http://localhost:3000/min/mask') // Express.js API 호출
   .then(response => response.json())
   .then(data => {
       const labels = data.map(row => row.region);
       const mask_8h_in = data.map(row => row.mask_8h_in);
       const no_mask_8h_in = data.map(row => row.no_mask_8h_in);
       const mask_12h_in = data.map(row => row.mask_12h_in);
       const no_mask_12h_in = data.map(row => row.no_mask_12h_in);

       const ctx = document.getElementById('mask-chart').getContext('2d');
       new Chart(ctx, {
           type: 'bar',
           data: {
               labels: labels,
               datasets: [
                   {
                       label: 'mask_8h_in',
                       data: mask_8h_in,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                       label: 'no_mask_8h_in',
                       data: no_mask_8h_in,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },

                   {
                        label: 'mask_12h_in',
                        data: mask_12h_in,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    },
                    {
                        label: 'no_mask_12h_in',
                        data: no_mask_12h_in,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
               ],
           },
       });
   });