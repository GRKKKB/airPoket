// 모달 요소 가져오기
const modal = document.getElementById("modal");

// "자세히 보기" 버튼과 "닫기" 버튼 가져오기
const closeModalBtns = modal.querySelectorAll("[data-dismiss='modal']");
const detailButton = modal.querySelector(".btn-primary");

// 모달 표시 함수
function showModal() {
    modal.style.display = "block"; // 모달 보이기
    modal.classList.add("show"); // 부트스트랩 효과 추가
    modal.setAttribute("aria-hidden", "false"); // 접근성 속성 변경
}

// 모달 숨김 함수
function hideModal() {
    modal.style.display = "none"; // 모달 숨기기
    modal.classList.remove("show"); // 부트스트랩 효과 제거
    modal.setAttribute("aria-hidden", "true"); // 접근성 속성 변경
}

// 페이지 로드 후 0.5초 후 모달 표시
window.onload = function () {
    setTimeout(showModal, 500);
};

// 닫기 버튼 클릭 이벤트 추가
closeModalBtns.forEach((btn) => {
    console.log("클릭스");
    btn.addEventListener("click", hideModal);
});

// "자세히 보기" 버튼 클릭 이벤트 추가
detailButton.addEventListener("click", function () {
    alert("자세히 보기 버튼이 클릭되었습니다!");
    // 추가 동작 구현 가능
});
