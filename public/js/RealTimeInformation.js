// DOM 요소 가져오기
const regionSelect = document.getElementById('region');
const stationSelect = document.getElementById('station');
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

  // 대기오염 데이터 (API 대신 mock 데이터 사용)
  const airData = [
    { region: '서울', station: '중구', time: '12:00', score: 85, pm10: 30, pm25: 20, o3: 0.03, no2: 0.02, co: 0.01, so2: 0.001 },
    { region: '서울', station: '강남구', time: '12:00', score: 80, pm10: 25, pm25: 15, o3: 0.025, no2: 0.018, co: 0.008, so2: 0.0009 }
  ];

  // 중금속 데이터 (API 대신 mock 데이터 사용)
  const metalData = [
    { region: '서울', time: '12:00', lead: 0.05, cadmium: 0.03, arsenic: 0.02, mercury: 0.01, chromium: 0.04 },
    { region: '서울', time: '12:00', lead: 0.06, cadmium: 0.035, arsenic: 0.025, mercury: 0.015, chromium: 0.045 }
  ];

  // 테이블 업데이트
  updateTableData(airData, 'air-data');
  updateTableData(metalData, 'metal-data');
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
        <td>${row.station}</td>
        <td>${row.time}</td>
        <td>${row.score}</td>
        <td>${row.pm10}</td>
        <td>${row.pm25}</td>
        <td>${row.o3}</td>
        <td>${row.no2}</td>
        <td>${row.co}</td>
        <td>${row.so2}</td>
      `;
    } else if (tableId === 'metal-data') {
      tr.innerHTML = `
        <td>${row.region}</td>
        <td>${row.time}</td>
        <td>${row.lead}</td>
        <td>${row.cadmium}</td>
        <td>${row.arsenic}</td>
        <td>${row.mercury}</td>
        <td>${row.chromium}</td>
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
regionSelect.addEventListener('change', fetchData);
stationSelect.addEventListener('change', fetchData);
