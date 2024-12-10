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


// 애니메이션 카드 2(황사관련페이지)
document.addEventListener("DOMContentLoaded", () => {
  const newAnimations = document.querySelectorAll(".new-animation");
  newAnimations.forEach((element, index) => {
      setTimeout(() => {
          element.classList.add("visible");
      }, index * 100); // 각 요소마다 100ms 지연
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
  // 지도 애니메이션을 적용할 요소
  const regions = document.querySelectorAll(".region img");
  const dokdoBox = document.getElementById("dokdoBox");
  const baeglyeongdo = document.getElementById("baeglyeongdo");

  // 페이지 로드 시 지도 애니메이션
  regions.forEach((region, index) => {
    region.style.opacity = 0;
    region.style.transform = "scale(0.9)";
    setTimeout(() => {
      region.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      region.style.opacity = 1;
      region.style.transform = "scale(1)";
    }, index * 200);
  });

  // 모든 지도 애니메이션이 끝난 후 박스 애니메이션 실행
  const totalDelay = regions.length * 100 + 300; // 지도 애니메이션 총 시간 계산
  setTimeout(() => {
    baeglyeongdo.classList.add("visible");
    dokdoBox.classList.add("visible");
  }, totalDelay); // 지도 애니메이션이 끝난 후 실행
});
