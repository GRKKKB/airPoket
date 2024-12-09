let currentIndex = 0;
let currentIndex2 = 0;

const newsItems = document.querySelectorAll('.news-item');
const newsItems2 = document.querySelectorAll('.news-item2');

// 초기 활성화
if (newsItems.length > 0) newsItems[currentIndex].classList.add('active');
if (newsItems2.length > 0) newsItems2[currentIndex2].classList.add('active');

// 첫 번째 뉴스 슬라이드 교체
function showNextNews() {
  newsItems[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % newsItems.length;
  newsItems[currentIndex].classList.add('active');
}

function showPrevNews() {
  newsItems[currentIndex].classList.remove('active');
  currentIndex = (currentIndex - 1 + newsItems.length) % newsItems.length;
  newsItems[currentIndex].classList.add('active');
}

// 두 번째 뉴스 슬라이드 교체
function showNextNews2() {
  newsItems2[currentIndex2].classList.remove('active');
  currentIndex2 = (currentIndex2 + 1) % newsItems2.length;
  newsItems2[currentIndex2].classList.add('active');
}

function showPrevNews2() {
  newsItems2[currentIndex2].classList.remove('active');
  currentIndex2 = (currentIndex2 - 1 + newsItems2.length) % newsItems2.length;
  newsItems2[currentIndex2].classList.add('active');
}

// 이벤트 리스너 추가
document.getElementById('next-news').addEventListener('click', showNextNews);
document.getElementById('prev-news').addEventListener('click', showPrevNews);
document.getElementById('next-news2').addEventListener('click', showNextNews2);
document.getElementById('prev-news2').addEventListener('click', showPrevNews);

// 자동 슬라이드 (3초 간격)
setInterval(showNextNews, 4000);
setInterval(showNextNews2, 6000);
