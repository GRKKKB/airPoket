async function updateStations(region) {
    const stationSelect = document.getElementById('station');

    // 기존 옵션 초기화
    stationSelect.innerHTML = '<option value="all">전체</option>';

    try {
        // API 호출
        const response = await fetch(`http://localhost:3927/air-pollution/procedure/serchOption?region=${region}`);
        const data = await response.json();

        // API 결과의 첫 번째 배열 가져오기
        const stations = data[0] || []; // 빈 배열로 처리

        if (stations.length === 0) {
            console.warn('No stations found for region:', region);
        }

        // station 옵션 추가
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.station_name;
            option.textContent = station.station_name;
            stationSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching station data:', error);
    }
}

// 이벤트 리스너 설정
document.getElementById('region').addEventListener('change', (event) => {
    const selectedRegion = event.target.value; // 선택된 지역
    console.log('Selected Region:', selectedRegion);
    updateStations(selectedRegion); // API 호출 및 옵션 업데이트
});

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    const defaultRegion = document.getElementById('region').value || 'Seoul'; // 기본 선택 지역 설정
    updateStations(defaultRegion); // API 호출 및 옵션 업데이트
});
