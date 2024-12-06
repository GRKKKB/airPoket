document.addEventListener('DOMContentLoaded', () => {
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
    // 중금속 데이터에 추가된 매핑
    경기권: '경기권',
    수도권: '수도권',
    강원권: '강원권',
    충북권: '충북권',
    충청권: '충청권',
    전북권: '전북권',
    호남권: '호남권',
    영남권: '영남권',
    제주도: '제주도',
    백령도: '백령도',
  };

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
  const updateRegionValues = async (apiUrl, regionField) => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data = await response.json();

      data.forEach(item => {
        const koreanRegion = regionMapping[item[regionField]];
        const regionClass = `.location-${item[regionField].toLowerCase()}`;
        const mapPoint = document.querySelector(regionClass);

        if (mapPoint) {
          const locationElement = mapPoint.querySelector('.location');
          const valueElement = mapPoint.querySelector('.value');

          let Status = '';
          let BackgroundColor = '';
          let HoverColor = '';

          const score = parseFloat(item.score);

          if (locationElement) {
            locationElement.textContent = koreanRegion || item[regionField];
          }
          if (valueElement) {
            // 점수에 따른 상태와 색상 설정
            if (score >= 0.03) {
              Status = '매우 나쁨';
              BackgroundColor = 'rgba(156, 39, 176, 0.5)';
              HoverColor = 'rgba(156, 39, 176, 0.8)';
            } else if (score >= 0.02) {
              Status = '나쁨';
              BackgroundColor = 'rgba(244, 67, 54, 0.5)';
              HoverColor = 'rgba(244, 67, 54, 0.8)';
            } else if (score >= 0.01) {
              Status = '보통';
              BackgroundColor = 'rgba(255, 193, 7, 0.5)';
              HoverColor = 'rgba(255, 193, 7, 0.8)';
            } else {
              Status = '좋음';
              BackgroundColor = 'rgba(76, 175, 80, 0.5)';
              HoverColor = 'rgba(76, 175, 80, 0.8)';
            }

            valueElement.textContent = score.toFixed(3); // 소수점 3자리로 표시
            mapPoint.style.backgroundColor = BackgroundColor;

            mapPoint.addEventListener('mouseenter', () => {
              mapPoint.style.boxShadow = `0 0 10px ${HoverColor}`;
            });

            mapPoint.addEventListener('mouseleave', () => {
              mapPoint.style.boxShadow = 'none';
            });
          }
        } else {
          console.warn(`"${item[regionField]}"에 해당하는 HTML 요소를 찾을 수 없습니다.`);
        }
      });
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    }
  };

  // 탭 버튼 클릭 이벤트 추가
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabs.forEach(tab => tab.classList.add('hidden'));

      button.classList.add('active');
      const target = button.dataset.target;
      const targetTab = document.getElementById(target);

      if (targetTab) {
        targetTab.classList.remove('hidden');

        // 탭에 따라 API 호출
        if (target === 'air-tab') {
          updateRegionValues('http://localhost:3000/air-pollution/dayairMap', 'region');
        } else if (target === 'metal-tab') {
          updateRegionValues('http://localhost:3000/metal/dayMetal', 'city_name');
        }
      } else {
        console.error(`ID가 "${target}"인 탭 콘텐츠를 찾을 수 없습니다.`);
      }
    });
  });

  // 초기 로드 시 대기오염 탭 데이터 호출
  updateRegionValues('http://localhost:3000/air-pollution/dayairMap', 'region');
});
