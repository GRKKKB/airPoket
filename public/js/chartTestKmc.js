    fetch('http://localhost:3000/chartTestKmc') // Express.js API 호출
        .then(response => response.json())
        .then(data => {
        const labels = data.map(row => row.timestamp);
        const AVG = data.map(row => row.AVG);
        

    const ctx = document.getElementById('chartTestKmc').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'mask_8h_in',
                    data: AVG,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
             
            ],
        },
    });
});