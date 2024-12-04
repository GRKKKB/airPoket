// JavaScript
const form = document.getElementById("search-form");
const chartsContainer = document.getElementById("charts-container");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // 페이지 새로고침 방지

  const region = document.getElementById("region").value.trim();
  const date = document.getElementById("date").value.trim();

  if (!region || !date) {
    alert("Please provide both region and date.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/air-pollution/procedure?region=${region}&date=${date}`
    );
    const data = await response.json();

    const pollutionData = data[0]; // 첫 번째 배열이 데이터
    if (!pollutionData || pollutionData.length === 0) {
      alert("No data found for the given region and date.");
      return;
    }

    // 기존 차트 삭제
    chartsContainer.innerHTML = "";

    // 차트를 생성할 데이터 키
    const metrics = [
      { key: "weighted_score", label: "Weighted Score (가중 점수)" },
      { key: "mask_8h_in", label: "Mask 8H In" },
      { key: "no_mask_8h_in", label: "No Mask 8H In" },
      { key: "mask_12h_in", label: "Mask 12H In" },
      { key: "no_mask_12h_in", label: "No Mask 12H In" },
      { key: "mask_8h_out", label: "Mask 8H Out" },
      { key: "no_mask_8h_out", label: "No Mask 8H Out" },
      { key: "mask_12h_out", label: "Mask 12H Out" },
      { key: "no_mask_12h_out", label: "No Mask 12H Out" },
    ];

    // 차트 생성
    metrics.forEach((metric) => {
      // 각 차트를 위한 캔버스 생성
      const chartWrapper = document.createElement("div");
      chartWrapper.style.marginBottom = "30px";
      const canvas = document.createElement("canvas");
      chartWrapper.appendChild(canvas);
      chartsContainer.appendChild(chartWrapper);

      // 데이터 준비
      const labels = pollutionData.map((row) => row.station_name); // 측정소 이름
      const dataValues = pollutionData.map((row) => row[metric.key]); // 해당 메트릭 값

      // 차트 생성
      new Chart(canvas.getContext("2d"), {
        type: "bar", // 막대형 차트
        data: {
          labels: labels,
          datasets: [
            {
              label: metric.label,
              data: dataValues,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Value",
              },
            },
            x: {
              title: {
                display: true,
                text: "Station Names",
              },
            },
          },
        },
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching data.");
  }
});
