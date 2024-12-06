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
    경기권: 'gyeonggigwon',
    수도권: 'sudogwon', // 수도권은 서울로 매핑
    강원권: 'gangwongwon',
    충북권: 'chungbukgwon',
    충청권: 'chungchunggwon',
    전북권: 'jeonbuggwon',
    호남권: 'honamgwon',
    영남권: 'yeongnamgwon',
    제주도: 'jejudo',
    백령도: 'baeglyeongdo',
    중부권: 'joongbugwon',
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

  // 대기오염 점수 업데이트
  const updateAirQuality = async () => {
    try {
      const response = await fetch('http://localhost:3000/air-pollution/dayairMap');
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data = await response.json();

      data.forEach(item => {
        const koreanRegion = regionMapping[item.region];
        const regionClass = `.location-${item.region.toLowerCase()}`;
        const mapPoint = document.querySelector(regionClass);

        if (mapPoint) {
          const locationElement = mapPoint.querySelector('.location');
          const valueElement = mapPoint.querySelector('.value');

          let BackgroundColor = '';
          let HoverColor = '';

          if (locationElement) {
            locationElement.textContent = koreanRegion || item.region;
          }
          if (valueElement) {
            const score = item.score;

            if (score >= 75) {
              BackgroundColor = 'rgba(156, 39, 176, 0.5)';
              HoverColor = 'rgba(156, 39, 176, 0.8)';
            } else if (score >= 50) {
              BackgroundColor = 'rgba(244, 67, 54, 0.5)';
              HoverColor = 'rgba(244, 67, 54, 0.8)';
            } else if (score >= 25) {
              BackgroundColor = 'rgba(255, 193, 7, 0.5)';
              HoverColor = 'rgba(255, 193, 7, 0.8)';
            } else {
              BackgroundColor = 'rgba(76, 175, 80, 0.5)';
              HoverColor = 'rgba(76, 175, 80, 0.8)';
            }

            valueElement.textContent = score;
            mapPoint.style.backgroundColor = BackgroundColor;

            mapPoint.addEventListener('mouseenter', () => {
              mapPoint.style.boxShadow = `0 0 10px ${HoverColor}`;
            });

            mapPoint.addEventListener('mouseleave', () => {
              mapPoint.style.boxShadow = 'none';
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


  // 중금속 점수 업데이트
  const updateMetalPollution = async () => {
    try {
      const response = await fetch('http://localhost:3000/metal/dayMetal');
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data = await response.json();

      data.forEach((item) => {
        const englishClass = regionMapping[item.city_name]; // 한글 이름을 영어 클래스 이름으로 변환
        if (!englishClass) {
          console.warn(`"${item.city_name}"에 대한 매핑을 찾을 수 없습니다.`);
          return;
        }

        const regionClass = `.location-${englishClass}`;
        const mapPoint = document.querySelector(regionClass);

        if (mapPoint) {
          const locationElement = mapPoint.querySelector('.location');
          const valueElement = mapPoint.querySelector('.value');

          let BackgroundColor = '';
          let HoverColor = '';

          if (locationElement) {
            locationElement.textContent = item.city_name; // API에서 받은 한글 이름 그대로 사용
            console.log(locationElement);
          }
          if (valueElement) {
            const score = parseFloat(item.score);

            if (score > 1) {
              BackgroundColor = 'rgba(244, 67, 54, 0.5)';
              HoverColor = 'rgba(244, 67, 54, 0.8)';
            } else {
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
          console.warn(`"${item.city_name}"에 해당하는 HTML 요소를 찾을 수 없습니다.`);
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

        if (target === 'air-tab') {
          updateAirQuality();
        } else if (target === 'metal-tab') {
          updateMetalPollution();
        }
      } else {
        console.error(`ID가 "${target}"인 탭 콘텐츠를 찾을 수 없습니다.`);
      }
    });
  });

  // 초기 로드 시 대기오염 탭 데이터 호출
  updateAirQuality();
});
