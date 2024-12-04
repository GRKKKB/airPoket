document.addEventListener('DOMContentLoaded', () => {
  // 탭 버튼과 탭 콘텐츠 선택
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabs = document.querySelectorAll('.tab-content');

  if (tabButtons.length === 0 || tabs.length === 0) {
    console.error('탭 버튼 또는 탭 콘텐츠가 존재하지 않습니다.');
    return;
  }

  // 초기화 - 첫 번째 탭만 활성화
  tabs.forEach(tab => tab.classList.add('hidden'));
  const firstTab = tabs[0];
  if (firstTab) firstTab.classList.remove('hidden');

  // 탭 버튼 클릭 이벤트 추가
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // 모든 탭 버튼에서 active 클래스 제거
      tabButtons.forEach((btn) => btn.classList.remove('active'));

      // 모든 탭 콘텐츠 숨기기
      tabs.forEach((tab) => tab.classList.add('hidden'));

      // 클릭된 탭 버튼에 active 클래스 추가
      button.classList.add('active');

      // 클릭된 탭 버튼과 연결된 콘텐츠 표시
      const target = button.dataset.target;
      const targetTab = document.getElementById(target);

      if (targetTab) {
        targetTab.classList.remove('hidden');
      } else {
        console.error(`ID가 "${target}"인 탭 콘텐츠를 찾을 수 없습니다.`);
      }
    });
  });
});

// 로딩화면 표시

window.addEventListener("load", () => {
  hideLoading();
});

showLoading(); // 초기 로딩 화면 표시