// 금칙어 목록
const forbiddenWords = ['욕설', '금칙어1', '금칙어2'];

// DOM 요소 가져오기
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const filterWarning = document.getElementById('filter-warning');

// WebSocket 연결
const ws = new WebSocket('ws://localhost:8080');

// WebSocket 메시지 수신 이벤트
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'new_comment') {
    const comment = message.data;
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.textContent = comment.content;
    commentsList.appendChild(commentElement);
  }
});

// 서버에서 댓글 목록 가져오기
const fetchComments = async () => {
  try {
    const response = await fetch('http://localhost:3000/comments');
    const data = await response.json();

    // 댓글 목록 초기화
    commentsList.innerHTML = '';
    data.forEach((comment) => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.textContent = comment.content;
      commentsList.appendChild(commentElement);
    });
  } catch (error) {
    console.error('댓글 가져오기 오류:', error);
  }
};

// 댓글 추가 이벤트
commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // 댓글 내용 가져오기
  const comment = commentInput.value.trim();

  // 금칙어 필터링
  const containsForbiddenWord = forbiddenWords.some((word) => comment.includes(word));
  if (containsForbiddenWord) {
    // 경고 메시지 표시
    filterWarning.style.display = 'block';
    setTimeout(() => {
      filterWarning.style.display = 'none';
    }, 8000);
    return;
  }

  // 서버에 댓글 추가 요청
  try {
    const response = await fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    });

    if (response.ok) {
      commentInput.value = ''; // 입력 필드 초기화
      // WebSocket을 통해 실시간 업데이트되므로 fetchComments() 호출 불필요
    } else {
      console.error('댓글 추가 실패:', await response.json());
    }
  } catch (error) {
    console.error('댓글 추가 요청 오류:', error);
  }
});

// 페이지 로드 시 댓글 목록 가져오기
fetchComments();
