  // 애니메이션을 적용할 요소 가져오기
  const cards = document.querySelectorAll(".animate-card");

  // 페이지 로드 시 애니메이션 트리거
  window.addEventListener("load", () => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("visible");
      }, index * 200); // 카드마다 200ms씩 지연
    });
  });



  // 애니메이션을 적용할 요소 가져오기
const chartSections = document.querySelectorAll(".chart-wrapper");

// 페이지 로드 시 애니메이션 트리거
window.addEventListener("load", () => {
  chartSections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add("visible");
    }, index * 300); // 섹션마다 300ms씩 지연
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const typingElements = document.querySelectorAll('.typing');

  typingElements.forEach((element) => {
      const text = element.textContent; // 기존 텍스트 저장
      element.textContent = ''; // 초기 텍스트 제거

      // 타이핑 애니메이션
      let i = 0;
      const interval = setInterval(() => {
          element.textContent += text.charAt(i);
          i++;
          if (i > text.length) clearInterval(interval);
      }, 50); // 글자 출력 속도 설정
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const typingElements = document.querySelectorAll('.typingSlow');

  typingElements.forEach((element) => {
      const text = element.textContent; // 기존 텍스트 저장
      element.textContent = ''; // 초기 텍스트 제거

      // 타이핑 애니메이션
      let i = 0;

      const typeText = () => {
          element.textContent = ''; // 텍스트 초기화
          let typingInterval = setInterval(() => {
              element.textContent += text.charAt(i);
              i++;
              if (i >= text.length) {
                  clearInterval(typingInterval); // 타이핑 완료
                  setTimeout(() => {
                      i = 0; // 인덱스 초기화
                      typeText(); // 다시 타이핑 시작
                  }, 1000); // 잠시 멈췄다가 반복
              }
          }, 100); // 글자 출력 속도 설정
      };

      typeText(); // 애니메이션 시작
  });
});



document.addEventListener("DOMContentLoaded", () => {
  // 애니메이션을 적용할 지도 요소 가져오기
  const regions = document.querySelectorAll(".region img");

  // 페이지 로드 시 애니메이션 트리거
  regions.forEach((region, index) => {
    region.style.opacity = 0; // 초기 상태: 투명
    region.style.transform = "scale(0.9)"; // 초기 상태: 약간 축소
    setTimeout(() => {
      region.style.transition = "opacity 0.6s ease, transform 0.6s ease"; // 애니메이션 설정
      region.style.opacity = 1; // 투명도 증가
      region.style.transform = "scale(1)"; // 원래 크기로 확대
    }, index * 200); // 각 지도마다 200ms 지연
  });
});
