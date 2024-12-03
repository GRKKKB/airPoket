document.addEventListener('DOMContentLoaded', () => {
    // 구성 비율 차트 (Pie Chart)
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['PM25', 'PM10', 'SO2', 'CO', 'O3', 'NO2'],
            datasets: [{
                data: [20, 25, 15, 10, 20, 10],
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

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
});
