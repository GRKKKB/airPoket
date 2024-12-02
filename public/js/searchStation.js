    // API 호출하여 station 옵션 업데이트
    async function updateStations(region) {
        const stationSelect = document.getElementById('station');
        
        // 기존 옵션 초기화
        stationSelect.innerHTML = '<option value="all">전체</option>';
        
        if (region === 'all') return; // 전체 선택 시 추가 작업 없음
        
        try {
            // API 호출
            const response = await fetch(`http://localhost:3000/air-pollution/procedure/serchOption?region=${region}`);
            const data = await response.json();
            
            // API 결과의 첫 번째 배열 가져오기
            const stations = data[0];
            
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
        updateStations(selectedRegion); // API 호출 및 옵션 업데이트
    });