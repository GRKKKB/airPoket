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
    const airResponse = await fetch('http://localhost:3000/realTime/air');
    const metalResponse = await fetch('http://localhost:3000/realTime/metal');
    const airChartResponse = await fetch("http://localhost:3000/realTime/air-chart");
    const metalChartResponse = await fetch("http://localhost:3000/realTime/metal-chart")

    

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
      return(cityName === 'all' || item.cityName === cityName);
    });

    updateChartData(filterCahrt,filteredAirData);


    updateMetalChartData(filterMetalChartData,metalData);

    updateTableData(filteredAirData, 'air-data');
    updateTableData(filteredMetallData, 'metal-data'); // 중금속 데이터는 필터링 필요 시 로직 추가


    
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
  }
}

let airChart = null; // 차트를 저장할 변수

function updateChartData(data1, data2) {
  const ctx = document.getElementById('chart-air');

  if (airChart) {
    // 기존 차트가 있으면 삭제
    airChart.destroy();
  }

  if (ctx) {


    // 데이터 처리
    const labels = data2.map(row => row.station_name || 'Unknown'); // X축 라벨
    const baselineValue = data1[0]?.weighted_score || 0; // 기준선 값 (데이터 1에서 첫 번째 값 사용)
    const baseline = Array(labels.length).fill(baselineValue); // 기준선 데이터를 X축 길이에 맞게 확장
    const barData = data2.map(row => row.weighted_score || 0); // 막대 데이터
    // 새로운 차트를 생성하고 변수에 저장
    airChart = new Chart(ctx, {
      data: {
        labels: labels, // X축 라벨
        datasets: [
          {
            type: 'line', // 기준선
            label: '지역일일평균',
            data: baseline,
            borderColor: 'rgba(255, 99, 132, 1)',
    
            fill: false, // 선 아래 채우기 비활성화
          },
          {
            type: 'bar', // 막대차트
            label: '종합건강점수',
            data: barData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
  }
  
}

let metalChart = null;
function updateMetalChartData(metal1,metal2){
  const ctx = document.getElementById('metal-chart')
  if(metalChart){
    metalChart.destroy();
  }
  if(ctx){

    const labels = metal2.map(row => row.city_name || 'Unknown');
    const baselineValue = metal1[0]?.metal_score || 0;
    const baseline = Array(labels.length).fill(baselineValue);
    const barData = metal1.map(row => row.metal_score || 0);
    metalChart=new Chart(ctx, {
      data: {
        labels: labels, // X축 라벨
        datasets: [
          {
            type: 'line', // 기준선
            label: '지역일일평균',
            data: baseline,
            borderColor: 'rgba(255, 99, 132, 1)',
    
            fill: false, // 선 아래 채우기 비활성화
          },
          {

            type: 'bar', // 막대차트
            label: '위험도',
            data: barData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)'
        
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
        <td>${row.PM19}</td>
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
