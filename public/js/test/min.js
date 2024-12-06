// async function fetchData() {

//     try {
//         const maskResponse = await fetch('http://localhost:3000/min/mask')

//         const maskData = await maskResponse.json();
       

//         const filterMaskRegionData = maskData.filter(item=>{
//             return(item.mask_8h_in);
//         })
//         console.log(maskData)


//         updateMask8hChartData(filterMaskRegionData,'');

//     }catch(error){
//         console.error('데이터를 가져오는 중 에러 발생:', error);

//     }

//   }
  
 
  

//   let mask_8h_inChart = null;


//   function updateMask8hChartData(data1,data2){
//     const ctx = document.getElementById('mask-in-8h-chart');
//     console.log(data1)
//     if(mask_8h_inChart){
//         mask_8h_inChart.destroy();
//     }

//     if(ctx){
//         const labels = data2.map(row => row.region || 'Unknown');
//         const barData1 = data1.map(row => row.mask_8h_in || 0);
//         const barData2 = data1.map(row => row.no_mask_8h_in || 0);

//         console.log(data1)
//         mask_8h_inChart = new Chart(ctx,{
//             data: {
//                 labels: labels, // X축 라벨
//                 datasets: [
//                   {
//                     type: 'bar', // 기준선
//                     label: '테스트',
//                     data: barData1,
//                     borderColor: 'rgba(255, 99, 132, 1)',
            
//                     fill: false, // 선 아래 채우기 비활성화
//                   },
//                   {
//                     type: 'bar', // 막대차트
//                     label: '테스트1',
//                     data: barData2,
//                     backgroundColor: 'rgba(75, 192, 192, 1)',
//                   },
//                 ],
//               },
//               options: {
//                 scales: {
//                   y: {
//                     beginAtZero: true, // Y축 0부터 시작
//                   },
//                 },
//               },

//         })
//     }
//   }




// 로드 될떄 실행
document.addEventListener('DOMContentLoaded',()=>{
    const defaultRegion = document.getElementById("work").value;
    updateChartData(defaultRegion);
    
});

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
                       label: '마스크 착용 8시간 실내 작업',
                       data: mask_8h_in,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                    type: 'bar',
                       label: '마스크 미착용 8시간 실내 작업',
                       data: no_mask_8h_in,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },

                   
               ],
           },
           options: {
            scales: {
              y: {
                beginAtZero: true,
                min:40,
                max:100
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
                       label: '마스크 착용 12시간 실내 작업',
                       data: mask_12h_in,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                    type: 'bar',
                       label: '마스크 미착용 12시간 실내 작업',
                       data: no_mask_12h_in,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },

               ],
           },

           options: {
            scales: {
              y: {
                beginAtZero: true,
                min:40,
                max:120
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
                       label: '마스크 착용 8시간 실외 작업',
                       data: mask_8h_out,
                       backgroundColor: 'rgba(75, 192, 192, 0.5)',
                   },
                   {
                    type: 'bar',
                       label: '마스크 미착용 8시간 실외 작업',
                       data: no_mask_8h_out,
                       backgroundColor: 'rgba(255, 99, 132, 0.5)',
                   },


                   
               ],
           },
           options: {
            scales: {
              y: {
                beginAtZero: true,
                min:40,
                max:160
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
                          label: '마스크 착용 12시간 실외 작업',
                          data: mask_12h_out,
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                      },
                      {
                        type: 'bar',
                          label: '마스크 미착용 8시간 실외 작업',
                          data: no_mask_12h_out,
                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      },


                  ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                    min:40,
                    max:180
                  },
                },
              },
          });
      });

      async function updateChartData(data1) {
       
        console.log(data1);
 
        try{
            const response = await fetch('http://localhost:3000/min/mask');
            const data = await response.json();

            const works = data[0]||[];
            if (works.length === 0){
                console.warn("No works found" ,mask_8h_in);
            }

        }catch(error){
            console.error("Error works",error);
        }

        
      }
      document.getElementById("work").addEventListener("change",(event) =>{

        const selectedRegion = event.target.value;


        console.log(selectedRegion);
        updateChartData(selectedRegion);
      })
