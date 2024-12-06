fetch('http://localhost:3000/bom') // Express.js API 호출
    .then(response => response.json())
    .then(data => {
        const regions = data.map(row => row.region); // 지역 이름
        const weightedScores = data.map(row => row.weighted_score); // 가중치 점수

        const ctx = document.getElementById('myChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar', // 차트 타입
            data: {
                labels: regions, // x축 레이블
                datasets: [{
                    label: '종합 건강 점수', // 데이터셋 레이블
                    data: weightedScores, // y축 데이터
                    backgroundColor: '#0064FF', // 막대 색상
                    borderColor: '#00BFFF', // 테두리 색상
                    borderWidth: 1 // 테두리 두께
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // y축 0에서 시작
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error); // 오류 처리
    });
