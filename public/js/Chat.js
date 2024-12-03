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
      commentElement.setAttribute('data-id', comment.id); // 댓글 ID를 속성으로 저장
      commentElement.textContent = comment.content;
      commentsList.appendChild(commentElement);
    }
  
    if (message.type === 'delete_comment') {
      const { id } = message.data;
      // 화면에서 댓글 제거
      const commentElement = commentsList.querySelector(`[data-id="${id}"]`);
      if (commentElement) {
        commentsList.removeChild(commentElement);
      }
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

// 알림 메시지 표시 함수
const showAlert = (message) => {
    const alertBox = document.getElementById('alert');
    alertBox.textContent = message;
    alertBox.classList.add('show');
    alertBox.classList.remove('hidden');
  
    // 3초 후 알림 사라짐
    setTimeout(() => {
      alertBox.classList.add('hidden');
      alertBox.classList.remove('show');
    }, 3000);
  };
  
  // 댓글 추가 이벤트
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const comment = commentInput.value.trim();
  
    // 금칙어 필터링
    const containsForbiddenWord = forbiddenWords.some((word) => comment.includes(word));
    if (containsForbiddenWord) {
      showAlert('금칙어가 포함된 메시지는 보낼 수 없습니다.');
      return;
    }
  
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
      } else if (response.status === 429) {
        showAlert('메시지를 너무 자주 보냈습니다. 잠시 후 다시 시도하세요.');
      } else {
        showAlert('댓글 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 추가 요청 오류:', error);
      showAlert('서버와 연결할 수 없습니다. 다시 시도해주세요.');
    }
  });

// 페이지 로드 시 댓글 목록 가져오기
fetchComments();
