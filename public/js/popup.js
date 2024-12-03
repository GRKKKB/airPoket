// 모달 요소 가져오기
const modal = document.getElementById("modal");


// 모달을 닫는 버튼 가져오기
const closeModalBtn = document.getElementById("closeModalBtn");

// 모달 보이기
function showModal(){
    modal.style.display = "flex";
}
//페이지 로드 후 0.5초 후 모달표시
window.onload = function() {
    setTimeout(showModal, 500);
};

// 모달 닫기 버튼 클릭 시 모달 숨기기
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

/* // 모달 외부 클릭 시 모달 숨기기
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
 */