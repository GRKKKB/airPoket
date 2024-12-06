
const today = document.getElementById('today');

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


async function fetchData() {
    try{
        //api 호출
        const metalNameResponse = await fetch('http://localhost:3000/totalInfo/week-metal-name');
        const metalResponse = await fetch('http://localhost:3000/totalInfo/week-metal-avg-ratio');
        const airResponse = await fetch('http://localhost:3000/totalInfo/week-air-avg-ratio');
        const rankResponse = await fetch('http://localhost:3000/totalInfo/week-air-avg-rank')
        

        const metalNameData = await metalNameResponse.json(); //data1
        const metalData = await metalResponse.json(); //data2
        const airData = await airResponse.json(); //data3
        const rankData = await rankResponse.json(); //data4
        

        rankData.forEach(item => {
            const koreanRegion = regionMapping[item.region]; // 영어 지역 이름을 한글로 매핑
            const regionClass = `.location-${item.region.toLowerCase()}`;
            const mapPoint = document.querySelector(regionClass);
            
            if(mapPoint){
                // 한글 이름 및 값 업데이트
                const locationElement = mapPoint.querySelector('.location');

                if (locationElement) {
                    locationElement.textContent = koreanRegion || item.region; // 한글 이름 설정
                  }
            }else {
                console.warn(`"${item.region}"에 해당하는 HTML 요소를 찾을 수 없습니다.`);
            }

        });

        updateChartData(metalNameData,metalData);
        updateAirChartData(airData);
        updateRankData(rankData);


    } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    fetchData(); // 초기 데이터 로드
});

function updateChartData(data1, data2) {
    // 구성 비율 차트 (Pie Chart)
    const pieCtx = document.getElementById('metalAvg').getContext('2d');
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

function updateAirChartData(data3){

    // 변화 통합 라인 차트 (Line Chart)
    const lineCtx = document.getElementById('airAvg').getContext('2d'); //airAvg
    console.log(data3);
    const weekLabels = Object.keys(data3[0]);
    console.log("테스트1111",weekLabels);
    const scores = Object.values(data3[0]);
    
    console.log(weekLabels);
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: weekLabels,
            datasets: [
                {
                    label:"성분 농도",
                    data: scores,
                    borderColor: '#5050FF',
                    fill: true,
                    backgroundColor: '#A4C3FF',
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
                        text: '성분',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '농도 수준',
                    },
                    beginAtZero: true,
                    min:-40,
                    max:100
                },
            },
        },
        
    });
}


function updateRankData(data4){
    // 도시별 대기질 순위 (Bar Chart)
    const barCtx = document.getElementById('barChart').getContext('2d');
    const labels = data4.map(row => row.region);
    console.log(labels);
    
    const ranking = data4.map(row => row.RANK);
    console.log(ranking);

    const scores = data4.map(row => row.weighted_score);
    console.log(scores);

    new Chart(barCtx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: '종합건강점수 반영 RANK',
                data: ranking,
                borderColor:'#FAF0AD',
                backgroundColor: '#FFC314'
            }],

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
                        text: '순위',
                    },
                    beginAtZero: true,
                    max:20,
                    min:0,
                    grid: {
                        drawOnChartArea: true,
                    },
                    ticks:{
                        font: {
                            size:14,
                        },
                    },


                },
                // y1:{
                //     title:{
                //         display: true,
                //         text: 'RANK',
                //     },


                //     type: "linear",
                //     display:true,
                //     position: "right",
                //     suggestedMin:17,
                //     suggestedMax:17,
                    
                //     ticks: {
                //         stepSize: 20,
                //         font: {
                //         size: 15,
                //         },
                //     } 

                // }
            },
        },
    });


    
}


