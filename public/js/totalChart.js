const today = document.getElementById('today');

// 현재 날짜 표시
function displayCurrentDate() {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    today.textContent = `현재 날짜: ${formattedDate}`;
  }

async function fetchData() {
    try{
        //api 호출
        const metalNameResponse = await fetch('http://localhost:3000/totalInfo/week-metal-name');
        const metalResponse = await fetch('http://localhost:3000/totalInfo/week-metal-avg-ratio');

        const metalNameData = await metalNameResponse.json(); //data1
        const metalData = await metalResponse.json(); //data2
     
        updateChartData(metalNameData,metalData);

    } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // 초기 데이터 로드
});

function updateChartData(data1, data2) {
    // 구성 비율 차트 (Pie Chart)
    const pieCtx = document.getElementById('totalInfo').getContext('2d');
    const labels = data1.map(row => row.element_name);
    console.log(labels);
    const scores = data2.map(row => row.measurement);
    console.log(scores);

    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                
                data: scores,
                backgroundColor: [
                    '#FF6384', 
                    '#36A1EB', 
                    '#FFCE56', 
                    '#2BC0C0', 
                    '#9966FF', 
                    ],
                options: {
                    resoponsive: false,
                    scales:{
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                
                
            },
            resoponsive: true,
            maintainAspectRatio:false
        } 
    });
}



    // 변화 통합 라인 차트 (Line Chart)
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: weekLabels,
            datasets: [
                {
                    label: 'PM25',
                    data: [12, 15, 10, 20, 25, 30, 18],
                    borderColor: 'red',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'PM10',
                    data: [20, 30, 25, 28, 35, 40, 32],
                    borderColor: 'orange',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'SO2',
                    data: [0.005, 0.004, 0.006, 0.007, 0.005, 0.008, 0.007],
                    borderColor: 'yellow',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'CO',
                    data: [0.3, 0.35, 0.32, 0.28, 0.3, 0.4, 0.35],
                    borderColor: 'green',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'O3',
                    data: [0.03, 0.04, 0.035, 0.025, 0.03, 0.04, 0.038],
                    borderColor: 'blue',
                    fill: false,
                    tension: 0.3,
                },
                {
                    label: 'NO2',
                    data: [0.01, 0.012, 0.011, 0.013, 0.015, 0.012, 0.011],
                    borderColor: 'purple',
                    fill: false,
                    tension: 0.3,
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '요일',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '농도 수준',
                    },
                    beginAtZero: true,
                },
            },
        },
    });

    // 도시별 대기질 순위 (Bar Chart)
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju'],
            datasets: [{
                label: '종합 건강 점수',
                data: [96, 91, 92, 94, 90],
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '도시',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '건강 점수',
                    },
                    beginAtZero: true,
                },
            },
        },
    });


