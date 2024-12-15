// 전역 변수 설정 (이미 선언된 경우 재선언 방지)
if (!window.API_BASE_URL) {
    window.API_BASE_URL = "https://airpoket-production.up.railway.app";
}

if (!window.WS_BASE_URL) {
    window.WS_BASE_URL = "wss://airpoket-production.up.railway.app";
}
