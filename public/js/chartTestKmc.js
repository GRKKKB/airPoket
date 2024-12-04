    fetch('http://localhost:3000/chartTestKmc') // Express.js API 호출
        .then(response => response.json())
        .then(data => {
        const labels = data.map(row => row.station_name);
        const pm25 = data.map(row => row.pm25);

    const ctx = document.getElementById('chartTestKmc').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'pm25',
                    data: pm25,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
             
            ],
        },
    });
});