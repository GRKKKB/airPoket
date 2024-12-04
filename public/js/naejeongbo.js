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



// 필터링된 데이터 출력 (카드 스타일 + 외부 점수 상태 표시)
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
        let healthColor = "";

        if (item.weighted_score >= 75) {
            healthStatus = "좋음";
            healthColor = "#4caf50"; // 녹색
        } else if (item.weighted_score >= 50) {
            healthStatus = "보통";
            healthColor = "#ffc107"; // 노란색
        } else if (item.weighted_score >= 25) {
            healthStatus = "나쁨";
            healthColor = "#f44336"; // 빨간색
        } else {
            healthStatus = "매우 나쁨";
            healthColor = "#9c27b0"; // 보라색
        }

      


        if (item.weighted_score >= 75) {
            healthStatus = "좋음";
            healthColor = "#4caf50"; // 녹색
        } else if (item.weighted_score >= 50) {
            healthStatus = "보통";
            healthColor = "#ffc107"; // 노란색
        } else if (item.weighted_score >= 25) {
            healthStatus = "나쁨";
            healthColor = "#f44336"; // 빨간색
        } else {
            healthStatus = "매우 나쁨";
            healthColor = "#9c27b0"; // 보라색
        }

        // 외부 점수 계산
        const externalScore = item.mask_8h_out + item.no_mask_8h_out + item.mask_12h_out + item.no_mask_12h_out;
        let externalStatus = "";
        let externalColor = "";

        if (externalScore > 800) {
            externalStatus = "위험";
            externalColor = "#f44336"; // 빨간색
        } else if (externalScore > 400) {
            externalStatus = "보통";
            externalColor = "#ffc107"; // 노란색
        } else {
            externalStatus = "좋음";
            externalColor = "#4caf50"; // 녹색
        }

        // 개별 항목 상태 계산 함수
        const getStatusAndColor = (score) => {
            if (score > 200) {
                return { status: "위험", color: "#f44336" };
            } else if (score > 100) {
                return { status: "보통", color: "#ffc107" };
            } else {
                return { status: "좋음", color: "#4caf50" };
            }
        };

        // 개별 점수 상태
        const mask8hOut = getStatusAndColor(item.mask_8h_out);
        const noMask8hOut = getStatusAndColor(item.no_mask_8h_out);
        const mask12hOut = getStatusAndColor(item.mask_12h_out);
        const noMask12hOut = getStatusAndColor(item.no_mask_12h_out);

        content += `
            <div style="border: 1px solid #ccc; border-radius: 10px; padding: 16px; width: 300px;  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h3 style="text-align: center; color: #555;">${item.region} (${item.station_name})</h3>
                <p style="font-size: 14px; color: #666; text-align: center;">측정 시간: ${item.hour}</p>
                
                <!-- 건강 점수 영역 -->
                <div style="margin-top: 16px; text-align: center;">
                    <h4> 종합 건강 점수 </h4>
                    <div style="margin: 0 auto; width: 80%; padding: 10px; border-radius: 8px; background-color: ${healthColor}; color: white; font-weight: bold;">
                     ${healthStatus}
                    </div>
                </div>

                <!-- 메인 외부 점수 -->
                <div style="margin-top: 16px; text-align: center;">
                    <h4>외부 작업 건강 점수</h4>
                    <div style="margin: 0 auto; width: 80%; padding: 10px; border-radius: 8px; background-color: ${externalColor}; color: white; font-weight: bold; text-align: center;">
                        ${externalStatus}
                    </div>
                </div>

                               
         

                <!-- 개별 점수 상태 -->
                <div style="margin-top: 16px; border-top: 1px solid #ddd; padding-top: 16px;">
                    <h4>개별 외부 점수</h4>
                    <p style="color: ${mask8hOut.color};"><strong>8시간 마스크 착용:</strong> ${mask8hOut.status} (${item.mask_8h_out} 점)</p>
                    <p style="color: ${noMask8hOut.color};"><strong>8시간 마스크 미착용:</strong> ${noMask8hOut.status} (${item.no_mask_8h_out} 점)</p>
                    <p style="color: ${mask12hOut.color};"><strong>12시간 마스크 착용:</strong> ${mask12hOut.status} (${item.mask_12h_out} 점)</p>
                    <p style="color: ${noMask12hOut.color};"><strong>12시간 마스크 미착용:</strong> ${noMask12hOut.status} (${item.no_mask_12h_out} 점)</p>
                </div>

                <!-- 상세 데이터 -->
                <div style="margin-top: 16px; border-top: 1px solid #ddd; padding-top: 16px;">
                  <h4>상세 데이터</h4>
                    <p><strong>초미세먼지(PM2.5):</strong> ${item.PM25} μg/m³</p>
                    <p><strong>미세먼지(PM10):</strong> ${item.PM19} μg/m³</p>
                    <p><strong>오존(SO₂):</strong> ${item.SO2} ppm</p>
                    <p><strong>이산화질소(CO):</strong> ${item.CO} ppm</p>
                    <p><strong>이산화황(O₃):</strong> ${item.O3} ppm</p>
                    <p><strong>일산화탄소(NO₂):</strong> ${item.NO2} ppm</p>
                </div>
            </div>
        `;
    });

    content += `</div>`;
    infoDiv.innerHTML += content;
}
