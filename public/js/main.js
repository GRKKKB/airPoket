const regionMapping = {
  Seoul: '서울',
  Busan: '부산',
  Daegu: '대구',
  Incheon: '인천',
  Gwangju: '광주',
  Daejeon: '대전',
  Ulsan: '울산',
  Gyeonggi: '경기',
  Gangwon: '강원',
  Chungbuk: '충북',
  Chungnam: '충남',
  Jeonbuk: '전북',
  Jeonnam: '전남',
  Gyeongbuk: '경북',
  Gyeongnam: '경남',
  Jeju: '제주',
  Sejong: '세종',
};



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
        const koreanRegion = regionMapping[item.region]; // 영어 지역 이름을 한글로 매핑
        const regionClass = `.location-${item.region.toLowerCase()}`;
        const mapPoint = document.querySelector(regionClass);

        



        if (mapPoint) {
          // 한글 이름 및 값 업데이트
          const locationElement = mapPoint.querySelector('.location');
          const valueElement = mapPoint.querySelector('.value');

          // 건강 점수 기준에 따른 상태 계산
          let Status = "";
          let BackgroundColor = "";
          let HoverColor = "";

          if (locationElement) {
            locationElement.textContent = koreanRegion || item.region; // 한글 이름 설정
          }
          if (valueElement) {
      

              // 점수에 따른 상태와 반투명 배경색 설정
              if (item.score >= 75) {
              Status = "매우 나쁨";
              BackgroundColor = "rgba(156, 39, 176, 0.5)"; // 보라색 반투명
              HoverColor = "rgba(156, 39, 176, 0.8)"; // 보라색 강도 높은 반투명
            } else if (item.score >= 50) {
              Status = "나쁨";
              BackgroundColor = "rgba(244, 67, 54, 0.5)"; // 빨간색 반투명
              HoverColor = "rgba(244, 67, 54, 0.8)"; // 빨간색 강도 높은 반투명
            } else if (item.score >= 25) {
              Status = "보통";
              BackgroundColor = "rgba(255, 193, 7, 0.5)"; // 노란색 반투명
              HoverColor = "rgba(255, 193, 7, 0.8)"; // 노란색 강도 높은 반투명
            } else {
              Status = "좋음";
              BackgroundColor = "rgba(76, 175, 80, 0.5)"; // 녹색 반투명
              HoverColor = "rgba(76, 175, 80, 0.8)"; // 녹색 강도 높은 반투명
            }
          

            valueElement.textContent = item.score; // 점수 업데이트

            // 반투명 배경색 적용
            mapPoint.style.backgroundColor = BackgroundColor;
            
            // 호버 효과 동적으로 설정
            mapPoint.addEventListener("mouseenter", () => {
              mapPoint.style.boxShadow = `0 0 10px ${HoverColor}`;
            });

            mapPoint.addEventListener("mouseleave", () => {
              mapPoint.style.boxShadow = "none"; // 호버가 끝나면 원래 상태로
            });

          }
        } else {
          console.warn(`"${item.region}"에 해당하는 HTML 요소를 찾을 수 없습니다.`);
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
