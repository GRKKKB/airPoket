// 스크롤 시 섹션에 애니메이션 추가
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".animated-section");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.5 }
    );
  
    sections.forEach((section) => observer.observe(section));
  });
  
  // 헤더 색상 변경 효과 추가
  const header = document.querySelector("#header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  
  // 스크롤 시 이미지 및 배경 흐림 효과 추가
  const images = document.querySelectorAll("img");
  const body = document.body; // body에 배경 흐림 효과 추가
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
  
    images.forEach((img) => {
      const imgPosition = img.getBoundingClientRect().top + scrollY;
      const distanceFromViewport = Math.abs(scrollY - imgPosition + windowHeight / 2);
  
      // 이미지를 스크롤 거리와 연관 지어 흐리게 만들기
      const blurValue = Math.min(20, distanceFromViewport / 100); // 최대 블러 값 20px
      img.style.filter = `blur(${blurValue}px)`; // blur 효과 적용
    });
  
    // body 배경 흐림 효과 (필요 시)
    const bodyBlurValue = Math.min(5, scrollY / 200); // 최대 블러 값 5px
    body.img.style.filter = `blur(${bodyBlurValue}px)`; // body에도 흐림 효과 적용
  });
  