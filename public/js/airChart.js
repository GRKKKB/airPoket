fetch('http://localhost:3000/chartAir') // Express.js API 호출
.then(response => response.json())
.then(data => {
const labels = data.map(row => row.station_name);
const weight = data.map(row => row.weighted_score);

const ctx = document.getElementById('chartAir').getContext('2d');
new Chart(ctx, {
type: 'bar',
data: {
    labels: labels,
    datasets: [
        {
            label: '건강 점수',
            data: weight,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
     
    ],
},
});
});