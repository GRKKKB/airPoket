// 문서가 모두 로드된 후 스크립트 실행
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup"); // 팝업 요소 가져오기

    const closePopupBtn = document.getElementById("closePopup"); // 팝업 닫기 버튼

    // 이전에 팝업이 닫혔는지 확인
    if (localStorage.getItem("popupClosed") !== "true") {
        popup.style.display = "block"; // 팝업 표시
    }


    // 팝업 닫기 버튼에 클릭 이벤트 추가
    closePopupBtn.onclick = () => {
        popup.style.display = "none"; // 팝업 숨김
        localStorage.setItem("popupClosed", "true"); // 팝업 닫힘 상태 저장
    };

    // 팝업 외부를 클릭하면 팝업 닫힘
    window.onclick = (event) => {
        if (event.target === popup) {
            popup.style.display = "none"; // 팝업 숨김
            localStorage.setItem("popupClosed", "true"); // 팝업 닫힘 상태 저장
        }
    };
});


// script.js

// 메인 페이지용 스크립트
const popupButton = document.getElementById('popup-button'); // 팝업 버튼 선택

popupButton.addEventListener('click', () => {
    window.open('popup.html', 'Popup', 'width=400,height=300'); // 팝업 창 열기
});

// 팝업 페이지용 스크립트
const closeButton = document.getElementById('close-button'); // 닫기 버튼 선택

if (closeButton) { // 닫기 버튼이 존재할 경우
    closeButton.addEventListener('click', () => {
        window.close(); // 팝업 창 닫기
    });
}
