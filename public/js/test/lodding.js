const loadingScreen = document.getElementById("loading-screen");

function showLoading() {
  loadingScreen.classList.remove("hidden");
}

function hideLoading() {
  loadingScreen.classList.add("hidden");
}



// 비동기 함수 (예시)
async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("데이터 로드 완료!");
      resolve();
    }, 3000);
  });
}
