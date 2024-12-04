const infoDiv = document.getElementById("info");
const citySelect = document.getElementById("city");
const countyInput = document.getElementById("county");
const updateLocationButton = document.getElementById("update-location");

// 도시 이름 매핑 (한글 → 영어)
const cities_korean = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];
const cities_english = ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju', 'Sejong'];

// 한글 도시 이름을 영어로 변환
const convertCityToEnglish = (koreanCity) => {
    const index = cities_korean.indexOf(koreanCity);
    return index !== -1 ? cities_english[index] : koreanCity; // 매핑되지 않으면 원래 값을 반환
};

// 네이버 지도 API가 로드된 후 실행
naver.maps.onJSContentLoaded = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Reverse Geocoding 호출
                naver.maps.Service.reverseGeocode({
                    coords: new naver.maps.LatLng(latitude, longitude),
                    orders: [naver.maps.Service.OrderType.ADDR]
                }, (status, response) => {
                    if (status === naver.maps.Service.Status.OK) {
                        const region = response.v2?.results?.[0]?.region;
                        const city = region?.area1?.alias || "지역 정보 없음"; // 시/도
                        const county = region?.area3?.name || "구/군 정보 없음"; // 구/군

                        infoDiv.innerHTML = `${city} ${county}`;
                        fetchRealTimeData(city, county);
                    } else {
                        infoDiv.innerHTML = "주소 정보를 가져올 수 없습니다.";
                    }
                });
            },
            (error) => {
                infoDiv.innerHTML = "위치를 가져올 수 없습니다.";
            }
        );
    } else {
        infoDiv.innerHTML = "이 브라우저는 Geolocation을 지원하지 않습니다.";
    }
};

// 사용자가 입력한 위치로 데이터 업데이트
updateLocationButton.addEventListener("click", () => {
    const selectedCity = citySelect.value; // 사용자가 선택한 시/도
    const enteredCounty = countyInput.value.trim(); // 사용자가 입력한 구/군

    if (!enteredCounty) {
        alert("구/군을 입력해주세요.");
        return;
    }

    infoDiv.innerHTML = `${selectedCity} ${enteredCounty}`;
    fetchRealTimeData(selectedCity, enteredCounty);
});

// 실시간 데이터 API 호출 및 필터링
function fetchRealTimeData(city, county) {
    const apiUrl = "http://localhost:3000/realTime/air";

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("네트워크 응답에 문제가 있습니다.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("전체 데이터:", data);
            
            const ErCity = convertCityToEnglish(city);

            // region을 기준으로 필터링
            const filteredByCity = data.filter(item => item.region === ErCity);

            // station_name에서 county와 가장 가까운 측정소 찾기
            const closestStation = findClosestStation(filteredByCity, county);

            console.log("가장 가까운 측정소:", closestStation);

            // 결과 출력
            if (closestStation) {
                displayFilteredData([closestStation]);
            } else {
                infoDiv.innerHTML += `<br>가까운 측정소를 찾을 수 없습니다.`;
            }
        })
        .catch((error) => {
            console.error("API 호출 오류:", error);
            infoDiv.innerHTML += `<br>실시간 데이터를 불러오는 데 문제가 발생했습니다.`;
        });
}

// station_name에서 county와 가장 가까운 측정소 찾기
function findClosestStation(filteredData, county) {
    let closestStation = null;
    let closestDistance = Infinity;

    filteredData.forEach(station => {
        const distance = levenshteinDistance(station.station_name, county);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestStation = station;
        }
    });

    return closestStation;
}

// Levenshtein 거리 계산 (문자열 유사도)
function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
}

// 필터링된 데이터 출력 (카드 스타일 + 건강 점수 영역)
function displayFilteredData(data) {
    if (data.length === 0) {
        infoDiv.innerHTML += `<br>조건에 맞는 데이터가 없습니다.`;
        return;
    }
    
    let content = `<h2 style="text-align: center;">대기오염 정보</h2>`;
    content += `<div style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">`;

    data.forEach((item) => {
        // 건강 점수 기준에 따른 상태 계산
        let healthStatus = "";
        if (item.weighted_score >= 75) {
            healthStatus = "좋음";
        } else if (item.weighted_score >= 50) {
            healthStatus = "보통";
        } else if (item.weighted_score >= 25) {
            healthStatus = "나쁨";
        } else {
            healthStatus = "매우 나쁨";
        }

        // 건강 상태에 따라 스타일 동적으로 변경
        let healthColor = "";
        switch (healthStatus) {
            case "좋음":
                healthColor = "#4caf50"; // 녹색
                break;
            case "보통":
                healthColor = "#ffc107"; // 노란색
                break;
            case "나쁨":
                healthColor = "#f44336"; // 빨간색
                break;
            case "매우 나쁨":
                healthColor = "#9c27b0"; // 보라색
                break;
        }

        content += `
            <div style="border: 1px solid #ccc; border-radius: 10px; padding: 16px; width: 300px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h3 style="text-align: center; color: #555;">${item.region} (${item.station_name})</h3>
                <p style="font-size: 14px; color: #666; text-align: center;">측정 시간: ${item.hour}</p>
                
                <!-- 건강 점수 영역 -->
                <div style="margin-top: 16px; text-align: center;">
                    <div style="margin: 0 auto; width: 80%; padding: 10px; border-radius: 8px; background-color: ${healthColor}; color: white; font-weight: bold;">
                        건강 점수: ${item.weighted_score}
                    </div>
                    <div style="margin-top: 8px;">
                        <img src="placeholder-image.png" alt="${healthStatus}" style="width: 100%; height: auto; border-radius: 10px;">
                    </div>
                </div>

                <!-- 상세 데이터 -->
                <div style="margin-top: 16px;">
                    <p><strong>초 미세먼지:</strong> ${item.PM25} μg/m³</p>
                    <p><strong>미세먼지:</strong> ${item.PM19} μg/m³</p>
                    <p><strong>오존:</strong> ${item.SO2} ppm</p>
                    <p><strong>이산화질소:</strong> ${item.CO} ppm</p>
                    <p><strong>이산화황:</strong> ${item.O3} ppm</p>
                    <p><strong>일산화탄소:</strong> ${item.NO2} ppm</p>
                </div>
            </div>
        `;
    });

    content += `</div>`;
    infoDiv.innerHTML += content;
}
