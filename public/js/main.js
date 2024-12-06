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

  // API 데이터로 지역 값 업데이트
  const updateRegionValues = async () => {
    try {
      const response = await fetch('http://localhost:3000/air-pollution/dayairMap');
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data = await response.json();

      // 지역 데이터 매핑
      data.forEach(item => {
        const regionClass = `.location-${item.region.toLowerCase()}`;
        const mapPoint = document.querySelector(regionClass);

        if (mapPoint) {
          // 값 업데이트
          const valueElement = mapPoint.querySelector('.value');
          if (valueElement) {
            valueElement.textContent = item.weighted_score;
          } else {
            console.warn(`${regionClass} 내에 .value 요소를 찾을 수 없습니다.`);
          }
        } else {
          console.warn(`${item.region}에 해당하는 지역을 찾을 수 없습니다.`);
        }
      });
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    }
  };

  // 화면 로드 시 API 호출 및 지역 값 업데이트
  updateRegionValues();

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

      // 탭 전환 시에도 API 호출
      updateRegionValues();
    });
  });
});
