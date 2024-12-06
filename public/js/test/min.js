   //8시간 실내 작업
   fetch('http://localhost:3000/min/mask') // Express.js API 호출
   .then(response => response.json())
   .then(data => {
       const labels = data.map(row => row.region);
       const mask_8h_in = data.map(row => row.mask_8h_in);
       const no_mask_8h_in = data.map(row => row.no_mask_8h_in);

       const baselineValue = data[0]?.mask_8h_in || 0;
       const baseline =Array(labels.length).fill(baselineValue);

       const baselineValue1 = data[0]?.no_mask_8h_in || 0;
       const baseline1 =Array(labels.length).fill(baselineValue1);

       const ctx = document.getElementById('mask-in-8h-chart').getContext('2d');
       new Chart(ctx, {
          
           data: {
               labels: labels,
               datasets: [
                   {    
                    type: 'bar',
                       label: 'mask_8h_in',
                       data: mask_8h_in,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                    type: 'bar',
                       label: 'no_mask_8h_in',
                       data: no_mask_8h_in,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },

                   {
                    type: 'line',
                    label: 'mask_8h_in line',
                    data: baseline,
                    backgroundColor: 'rgba(75, 192, 192,1)',
                    fill: false, // 선 아래 채우기 비활성화
                },

                    {
                        type: 'line',
                        label: 'no_mask_8h_in line',
                        data: baseline1,
                        backgroundColor: 'rgba(255, 99, 132,1)',
                        fill: false, // 선 아래 채우기 비활성화
                    },
                   
               ],
           },
           options: {
            scales: {
              y: {
                beginAtZero: true, // Y축 0부터 시작
              },
            },
          },
       });
   });
   //12시간 실내 작업
   fetch('http://localhost:3000/min/mask') // Express.js API 호출
   .then(response => response.json())
   .then(data => {
       const labels = data.map(row => row.region);
       const mask_12h_in = data.map(row => row.mask_12h_in);
       const no_mask_12h_in = data.map(row => row.no_mask_12h_in);

       const baselineValue = data[0]?.mask_12h_in || 0;
       const baseline =Array(labels.length).fill(baselineValue);

       const baselineValue1 = data[0]?.no_mask_12h_in || 0;
       const baseline1 =Array(labels.length).fill(baselineValue1);

       const ctx = document.getElementById('mask-in-12h-chart').getContext('2d');
       new Chart(ctx, {
           
           data: {
               labels: labels,
               datasets: [
                   {
                    type: 'bar',
                       label: 'mask_12h_in',
                       data: mask_12h_in,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                    type: 'bar',
                       label: 'no_mask_12h_in',
                       data: no_mask_12h_in,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },
                   {
                    type: 'line',
                    label: 'mask_12h_in line',
                    data: baseline,
                    backgroundColor: 'rgba(75, 192, 192,1)',
                    fill: false, // 선 아래 채우기 비활성화
                },

                    {
                        type: 'line',
                        label: 'no_mask_12h_in line',
                        data: baseline1,
                        backgroundColor: 'rgba(255, 99, 132,1)',
                        fill: false, // 선 아래 채우기 비활성화
                    },
               ],
           },

           options: {
            scales: {
              y: {
                beginAtZero: true, // Y축 0부터 시작
              },
            },
          },
       });
   });
   //8시간 실외 작업
   fetch('http://localhost:3000/min/mask') // Express.js API 호출
   .then(response => response.json())
   .then(data => {
       const labels = data.map(row => row.region);
       const mask_8h_out = data.map(row => row.mask_8h_out);
       const no_mask_8h_out = data.map(row => row.no_mask_8h_out);

       const baselineValue = data[0]?.mask_8h_out || 0;
       const baseline =Array(labels.length).fill(baselineValue);

       const baselineValue1 = data[0]?.no_mask_8h_out || 0;
       const baseline1 =Array(labels.length).fill(baselineValue1);
       const ctx = document.getElementById('mask-out-8h-chart').getContext('2d');  
       new Chart(ctx, {
           
           data: {
               labels: labels,
               datasets: [
                   {   
                    type: 'bar',
                       label: 'mask_8h_out',
                       data: mask_8h_out,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                    type: 'bar',
                       label: 'no_mask_8h_out',
                       data: no_mask_8h_out,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },

                   {
                    type: 'line',
                    label: 'mask_8h_out line',
                    data: baseline,
                    backgroundColor: 'rgba(75, 192, 192,1)',
                    fill: false, // 선 아래 채우기 비활성화
                },

                    {
                        type: 'line',
                        label: 'no_mask_8h_out line',
                        data: baseline1,
                        backgroundColor: 'rgba(255, 99, 132,1)',
                        fill: false, // 선 아래 채우기 비활성화
                    },
                   
               ],
           },
           options: {
            scales: {
              y: {
                beginAtZero: true, // Y축 0부터 시작
              },
            },
          },
       });
   });


      //12시간 실외 작업
      fetch('http://localhost:3000/min/mask') // Express.js API 호출
      .then(response => response.json())
      .then(data => {
          const labels = data.map(row => row.region);
          const mask_12h_out = data.map(row => row.mask_12h_out);
          const no_mask_12h_out = data.map(row => row.no_mask_12h_out);


          const baselineValue = data[0]?.mask_12h_out || 0;
          const baseline =Array(labels.length).fill(baselineValue);
   
          const baselineValue1 = data[0]?.no_mask_12h_out || 0;
          const baseline1 =Array(labels.length).fill(baselineValue1);
   
          const ctx = document.getElementById('mask-out-12h-chart').getContext('2d');
          new Chart(ctx, {
              
              data: {
                  labels: labels,
                  datasets: [
                      {
                        type: 'bar',
                          label: 'mask_12h_out',
                          data: mask_12h_out,
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                      },
                      {
                        type: 'bar',
                          label: 'no_mask_12h_out',
                          data: no_mask_12h_out,
                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      },

                      {
                        type: 'line',
                        label: 'mask_12h_out line',
                        data: baseline,
                        backgroundColor: 'rgba(75, 192, 192,1)',
                        fill: false, // 선 아래 채우기 비활성화
                    },
    
                    {
                        type: 'line',
                        label: 'no_mask_12h_out line',
                        data: baseline1,
                        backgroundColor: 'rgba(255, 99, 132,1)',
                        fill: false, // 선 아래 채우기 비활성화
                        },
                  ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true, // Y축 0부터 시작
                  },
                },
              },
          });
      });