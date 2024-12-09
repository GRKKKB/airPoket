// DOM 요소 가져오기
const regionSelect = document.getElementById('region');
const stationSelect = document.getElementById('station');
const citySelect= document.getElementById('city_name');
const metalSelct = document.getElementById('metal-score');
const today = document.getElementById('today');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');


// 현재 날짜 표시
function displayCurrentDate() {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  today.textContent = `현재 날짜: ${formattedDate}`;
}

// 데이터 검색 함수
async function fetchData() {
  const region = regionSelect.value;
  const station = stationSelect.value;
  const cityName = citySelect.value;


  try {
    // API 호출
    const airResponse = await fetch('http://localhost:3927/realTime/air');
    const metalResponse = await fetch('http://localhost:3927/realTime/metal');
    const airChartResponse = await fetch("http://localhost:3927/realTime/air-chart");
    const metalChartResponse = await fetch("http://localhost:3927/realTime/metal-chart")

    

    const airData = await airResponse.json();
    const metalData = await metalResponse.json();
    const airChartData = await airChartResponse.json();
    const metalChartData = await metalChartResponse.json();



    // 선택된 옵션에 따른 데이터 필터링
    const filteredAirData = airData.filter(item => {
      return (region === 'all' || item.region === region) &&
             (station === 'all' || item.station_name === station);
    });

    const filteredMetallData = metalData.filter(item =>{
      
      return(cityName === 'all' || item.city_name === cityName);
    });

    
    const filterCahrt = airChartData.filter(item =>{
      return(region == 'all' || item.region === region);
    });

    const filterMetalChartData = metalChartData.filter(item =>{
      return(cityName === 'all' || item.city_name === cityName);
    });

    updateChartData(filterCahrt,filteredAirData);


    updateMetalChartData(filterMetalChartData,filterMetalChartData);

    updateTableData(filteredAirData, 'air-data');
    updateTableData(filteredMetallData, 'metal-data'); // 중금속 데이터는 필터링 필요 시 로직 추가
    console.log(filteredMetallData)

    
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
  }
}

let airChart = null; // 차트를 저장할 변수
function updateChartData(data1, data2) {
    const ctx = document.getElementById('chart-air').getContext('2d');

    if (airChart) {
        airChart.destroy(); // 기존 차트가 있으면 삭제
    }
    console.log("data1",data1)
    console.log("data2",data2)

    if (ctx) {
        // 데이터 처리
        const labels = data2.map(row => row.station_name || 'Unknown'); // X축 라벨
        const baselineValue = data1[0]?.weighted_score || 0; // 기준선 값
        const baseline = Array(labels.length).fill(baselineValue); // 기준선 데이터
        const barData = data2.map(row => row.weighted_score || 0); // 막대 데이터

        // 그라데이션 배경 생성
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(75, 192, 192, 0.5)');
        gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

        airChart = new Chart(ctx, {
            type: 'bar', // 기본 막대형 차트
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'line', // 기준선
                        label: '지역일일평균',
                        data: baseline,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                        fill: false,
                        tension: 0.3, // 곡선 부드럽게
                    },
                    {
                        type: 'bar', // 막대차트
                        label: '종합건강점수',
                        data: barData,
                        backgroundColor: gradient,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                            },
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `값: ${tooltipItem.raw}`;
                            },
                        },
                    },
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutBounce', // 애니메이션 효과
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)', // X축 그리드 색상
                        },
                    },
                    y: {
                        beginAtZero: true, // Y축 0부터 시작
                        ticks: {
                            stepSize: 10, // Y축 간격
                        },
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)',
                        },
                    },
                },
            },
        });
    }
}

let metalChart = null; // 중금속 차트를 저장할 변수
function updateMetalChartData(metal1, metal2) {
    const ctx = document.getElementById('metal-chart').getContext('2d');

    if (metalChart) {
        metalChart.destroy(); // 기존 차트가 있으면 삭제
    }
    console.log("metal1",metal1);
    console.log("metal2",metal2);
    if (ctx) {
        const labels = metal2.map(row => row.city_name || 'Unknown');
        const baselineValue = metal1[0]?.metal_score || 0;
        const baseline = Array(labels.length).fill(baselineValue);
        const barData = metal1.map(row => row.metal_score || 0);

        const gradient = ctx.createRadialGradient(200, 200, 100, 200, 200, 300);
        gradient.addColorStop(0, 'rgba(255, 159, 64, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 159, 64, 0)');

        metalChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: '지역일일평균',
                        data: baseline,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(153, 102, 255, 0.8)',
                        fill: false,
                        tension: 0.3,
                    },
                    {
                        type: 'bar',
                        label: '위험도',
                        data: barData,
                        backgroundColor: gradient,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                            },
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `위험도: ${tooltipItem.raw}`;
                            },
                        },
                    },
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutExpo', // 애니메이션 효과
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)',
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 20,
                        },
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)',
                        },
                    },
                },
            },
        });
    }
}


  




// 테이블 업데이트 함수
function updateTableData(data, tableId) {
  const tableBody = document.getElementById(tableId);
  tableBody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    if (tableId === 'air-data') {
      tr.innerHTML = `
        <td>${row.region}</td>
        <td>${row.station_name}</td>
        <td>${row.hour}</td>
        <td>${row.weighted_score}</td>
        <td>${row.PM25}</td>
        <td>${row.PM10}</td>
        <td>${row.SO2}</td>
        <td>${row.CO}</td>
        <td>${row.O3}</td>
        <td>${row.NO2}</td>
      `;
    } else if (tableId === 'metal-data') {
      tr.innerHTML = `
        <td>${row.city_name}</td>
        <td>${row.HOUR}</td>
        <td>${row.Pb}</td>
        <td>${row.Ni}</td>
        <td>${row.Mn}</td>
        <td>${row.Zn}</td>
        <td>${row.S}</td>
      `;
    }
    tableBody.appendChild(tr);
  });
}


// 탭 전환 이벤트
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
  
  displayCurrentDate();
  fetchData(); // 초기 데이터 로드
});



// 옵션 변경 시 데이터 검색
citySelect.addEventListener('change' , fetchData);
regionSelect.addEventListener('change', fetchData);
stationSelect.addEventListener('change', fetchData);
