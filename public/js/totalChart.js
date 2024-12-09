const today = document.getElementById('today');

// 지역 이름 매핑 객체: 영어를 한글로 변환
const regionMapping = {
    Seoul: '서울',
    Busan: '부산',
    Daegu: '대구',
    Incheon: '인천',
    Gwangju: '광주',
    Daejeon: '대전',
    Ulsan: '울산',
    Gyeonggi: '경기',
    Gangwon: '강원',
    Chungbuk: '충북',
    Chungnam: '충남',
    Jeonbuk: '전북',
    Jeonnam: '전남',
    Gyeongbuk: '경북',
    Gyeongnam: '경남',
    Jeju: '제주',
    Sejong: '세종',
};

// 현재 날짜 표시
function displayCurrentDate() {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    today.textContent = `현재 날짜: ${formattedDate}`;
}

// API 데이터를 가져오는 비동기 함수
async function fetchData() {
    try {
        // API 호출
        const metalNameResponse = await fetch('http://localhost:3927/totalInfo/week-metal-name');
        const metalResponse = await fetch('http://localhost:3927/totalInfo/week-metal-avg-ratio');
        const airResponse = await fetch('http://localhost:3927/totalInfo/week-air-avg-ratio');
        const rankResponse = await fetch('http://localhost:3927/totalInfo/week-air-avg-rank');

        // 응답 JSON 데이터로 변환
        const metalNameData = await metalNameResponse.json(); // 중금속 이름 데이터
        const metalData = await metalResponse.json(); // 중금속 비율 데이터
        const airData = await airResponse.json(); // 대기질 변화 데이터
        const rankData = await rankResponse.json(); // 도시별 순위 데이터

        // 차트 데이터 업데이트 함수 호출
        updateChartData(metalNameData, metalData);

        updateChartDataNormalized(metalNameData, metalData);

        updateAirChartData(airData);
        updateRankData(rankData);
    } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate(); // 현재 날짜 표시
    fetchData(); // API 데이터 로드 및 차트 업데이트
});




// 중금속 구성 비율 차트 업데이트 함수
function updateChartData(data1, data2) {
    // canvas 요소 가져오기
    const pieCtx = document.getElementById('metalAvg').getContext('2d');


    // 데이터 매칭: data1의 element_name 순서대로 data2에서 measurement 가져오기
    const labels = data1.map(row => row.element_name); // 중금속 이름 목록
    const scores = labels.map(label => {
        // data2에서 element_name이 같은 데이터를 찾고 그 measurement 값을 반환
        const matchingData = data2.find(row => row.element_name === label);
        return matchingData ? parseFloat(matchingData.measurement) : 0; // 값이 없으면 0
    });

    // Pie Chart 생성
    new Chart(pieCtx, {
        type: 'pie', // 차트 유형: 파이 차트
        data: {
            labels: labels, // 레이블 (중금속 이름)
            datasets: [{
                data: scores, // 데이터 (중금속 비율)
                backgroundColor: ['#FF6384', '#36A1EB', '#FFCE56', '#2BC0C0', '#9966FF'], // 색상 배열
            }]
        },
        options: {
            plugins: {
                legend: { position: 'top' }, // 범례 위치
            },
            responsive: false, // 반응형 비활성화
            maintainAspectRatio: true, // 비율 유지

        }
    });
} 



function updateChartDataNormalized(data1, data2) {
    // canvas 요소 가져오기
    const pieCtx = document.getElementById('metalAvg2').getContext('2d');

    // 데이터 매칭
    const labels = data1.map(row => row.element_name);
    const rawValues = labels.map(label => {
        const matchingData = data2.find(row => row.element_name === label);
        return matchingData ? parseFloat(matchingData.measurement) : 0; // 값이 없으면 0
    });

    // 로그 변환 수행 (값이 너무 작거나 큰 차이를 완화)
    const transformedValues = rawValues.map(value => Math.log(value + 1)); // 로그 변환

    // 퍼센트 계산
    const total = transformedValues.reduce((sum, value) => sum + value, 0);
    const percentages = transformedValues.map(value => (value / total * 100).toFixed(1));

    // Pie Chart 생성
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: labels.map((label, index) => `${label} (${percentages[index]}%)`), // 레이블에 퍼센트 포함
            datasets: [{
                data: transformedValues,
                backgroundColor: ['#FF6384', '#36A1EB', '#FFCE56', '#2BC0C0', '#9966FF'], // 색상 배열
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14 },
                        color: '#333',
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const value = rawValues[tooltipItem.dataIndex];
                            return `${tooltipItem.label}: 원 데이터 ${value}`;
                        },
                    },
                },
            },
            responsive: false, // 반응형 비활성화
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true,
            },
        },
    });
}

function updateChartData(data1, data2) {
    // canvas 요소 가져오기
    const pieCtx = document.getElementById('metalAvg').getContext('2d');

    // 데이터 매칭
    const labels = data1.map(row => row.element_name);
    const scores = labels.map(label => {
        const matchingData = data2.find(row => row.element_name === label);
        return matchingData ? parseFloat(matchingData.measurement) : 0;
    });

    // 그라데이션 색상 생성
    const gradientColors = labels.map((_, index) => {
        const gradient = pieCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, `hsl(${index * 45}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${index * 45}, 90%, 80%)`);
        return gradient;
    });

    // Pie Chart 생성
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: scores,
                backgroundColor: gradientColors, // 그라데이션 색상
                borderWidth: 2, // 외곽선 두께
                borderColor: '#ffffff', // 외곽선 색상
                hoverOffset: 10, // 호버 시 분리 효과
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right', // 범례 위치
                    labels: {
                        font: { size: 14 }, // 폰트 크기
                        color: '#333', // 폰트 색상
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const percentage = ((value / scores.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        },
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)', // 툴팁 배경색
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                    formatter: (value, context) => {
                        const percentage = ((value / scores.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                        return `${percentage}%`;
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateScale: true,
                animateRotate: true,
            },
        },
        plugins: [ChartDataLabels], // 데이터 라벨 플러그인 추가
    });
}


// 대기질 변화 차트 업데이트 함수
function updateAirChartData(data3) {
    // canvas 요소 가져오기
    const lineCtx = document.getElementById('airAvg').getContext('2d');

    // 데이터 준비
    const weekLabels = Object.keys(data3[0]); // x축 레이블 (요일 등)
    const scores = Object.values(data3[0]); // y축 데이터

    // Line Chart 생성
    new Chart(lineCtx, {
        type: 'line', // 차트 유형: 라인 차트
        data: {
            labels: weekLabels, // 레이블
            datasets: [{
                label: "성분 농도",
                data: scores, // 데이터
                borderColor: '#5050FF', // 선 색상
                fill: true, // 영역 색상 활성화
                backgroundColor: '#A4C3FF', // 영역 색상
                tension: 0.3, // 선의 곡률
            }]
        },
        options: {
            plugins: {
                legend: { position: 'top' }, // 범례 위치
            },
            scales: {
                x: {
                    title: { display: true, text: '성분' }, // x축 제목
                },
                y: {
                    title: { display: true, text: '농도 수준' }, // y축 제목
                    beginAtZero: true, // y축 값 0에서 시작
        
                },
            },
        },
    });
}

function updateRankData(data4) {
    // canvas 요소 가져오기
    const barCtx = document.getElementById('barChart').getContext('2d');

    // 데이터 준비
    const labels = data4.map(row => regionMapping[row.region]); // 도시 이름
    const scores = data4.map(row => row.weighted_score); // 종합 건강 점수
    const rank = data4.map(row => row.RANK); // 순위

    // 순위 데이터를 반전하여 1이 가장 크게 보이도록 변환
    const maxRank = Math.max(...rank); // 최대 순위 값 찾기
    const invertedRank = rank.map(r => maxRank - r + 1); // 반전 데이터 계산

    // PolarArea Chart 생성
    new Chart(barCtx, {
        type: 'polarArea', // 차트 유형: PolarArea
        data: {
            labels: labels, // 도시 이름
            datasets: [{
                label: '도시 순위',
                data: invertedRank, // 반전된 순위 데이터
                backgroundColor: [
                    '#FFA500', '#FFAF0A', '#FFB914', '#FFC31E', 
                    '#FFD732', '#FFDC37', '#FFE13C', '#FFE641',
                    '#FFEB46', '#FFA98F', '#FFB399', '#FFBDA3',
                    '#FFC7AD', '#FFD1B7', '#FFDBC1', '#FFE0C6',
                    '#FFE5CB'
                ], // 색상 배열
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        // 툴팁에 점수를 추가로 표시
                        label: function(tooltipItem) {
                            const city = labels[tooltipItem.dataIndex]; // 도시 이름
                            const score = scores[tooltipItem.dataIndex]; // 점수
                            const rank = tooltipItem.raw; // 반전된 순위 데이터
                            const originalRank = maxRank - rank + 1; // 원래 순위 복원
                            return `${city}: 순위 ${originalRank}, 점수 ${score}`;
                        }
                    }
                },
                legend: { position: 'top' }, // 범례 위치
            },
            responsive: false, // 반응형 설정
            maintainAspectRatio: false, // 캔버스 비율 유지 비활성화
        },
    });
}
