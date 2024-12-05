const filterWarning = document.getElementById('filter-warning');

// 알림 메시지 표시 함수
const showAlert = (message) => {
    filterWarning.textContent = message;
    filterWarning.style.display = 'block';
  
    // 3초 후 경고 메시지 숨기기
    setTimeout(() => {
      filterWarning.style.display = 'none';
    }, 3000);
  };