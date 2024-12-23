/********************************************
 * [ 전역에서 API_BASE_URL, WS_BASE_URL 설정이 필요 ]
 * 예) 
 * <script>
 *   const API_BASE_URL = "http://localhost:3000";
 *   const WS_BASE_URL = "ws://localhost:3000";
 * </script>
 ********************************************/

/***************************************
 * 1) 기본 세팅
 ***************************************/
const forbiddenWords = ['욕설', '금칙어1', '금칙어2'];
const chatBubbleContainer = document.getElementById('chat-bubble-container');
const liveChatForm = document.getElementById('live-chat-form');
const liveChatInput = document.getElementById('live-chat-input');
const forbiddenAlert = document.getElementById('forbidden-alert');

// WebSocket 연결 (주의: WS_BASE_URL 정의되어 있어야 함!)
const ws = new WebSocket(WS_BASE_URL);

/**
 * 랜덤 표시에 활용할 댓글 목록
 */
let commentList = [];

/** 랜덤 표시를 위한 setInterval ID */
let randomTimer = null;

/***************************************
 * 2) 유틸/부가 함수
 ***************************************/

/** 경고 메시지 띄우기 */
function showForbiddenAlert(msg) {
  forbiddenAlert.textContent = msg;
  forbiddenAlert.style.display = 'block';
  setTimeout(() => {
    forbiddenAlert.style.display = 'none';
  }, 3000);
}

/** 채팅 버블 생성 함수 */
function createChatBubble(content, isMine = false) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble');
  
  // "내 댓글" 강조 스타일이 필요하면 주석 해제
  if (isMine) {
    bubble.classList.add('my-message');
  }

  bubble.textContent = content;
  return bubble;
}

/**
 * 채팅창에 버블 하나 추가 (최대 3개 유지)
 */
function addBubble(content, isMine = false) {
  const bubble = createChatBubble(content, isMine);
  chatBubbleContainer.appendChild(bubble);

  // 등장 애니메이션(기존 CSS .active transition)
  requestAnimationFrame(() => {
    bubble.classList.add('active');
  });

  // 최대 3개만 유지한다면
  if (chatBubbleContainer.children.length > 3) {
    const oldest = chatBubbleContainer.firstElementChild;
    oldest.remove();
  }
}

/***************************************
 * 3) 랜덤 댓글 표시 로직
 ***************************************/
function showRandomComment() {
  if (commentList.length === 0) return;

  // 랜덤 인덱스
  const randomIndex = Math.floor(Math.random() * commentList.length);
  // 해당 댓글 추출 & 배열에서 제거
  const [randomComment] = commentList.splice(randomIndex, 1);

  addBubble(randomComment.content, false);
}

/**
 * 주기적으로 랜덤 댓글 표시
 */
function startRandomLoop(intervalMs = 3000) {
  if (randomTimer) return; // 중복 시작 방지
  randomTimer = setInterval(() => {
    showRandomComment();
    if (commentList.length === 0) {
      stopRandomLoop();
    }
  }, intervalMs);
}

function stopRandomLoop() {
  if (randomTimer) {
    clearInterval(randomTimer);
    randomTimer = null;
  }
}

/***************************************
 * 4) 서버 & WebSocket 연동
 ***************************************/

/** (4-1) 서버에서 기존 댓글 목록 가져오기 */
async function fetchComments() {
  try {
    // API_BASE_URL 정의돼 있어야 함!
    const res = await fetch(`${API_BASE_URL}/comments`);
    const data = await res.json();
    
    commentList = data;
    // 가져온 뒤, 랜덤 표시 시작
    if (commentList.length > 0) {
      startRandomLoop(3000);
    }
  } catch (err) {
    console.error('댓글 목록 가져오기 오류:', err);
  }
}

/** (4-2) WebSocket 메시지 수신 */
ws.addEventListener('open', () => {
  console.log('[CLIENT] WebSocket connected:', WS_BASE_URL);
});

ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  // 새 댓글
  if (message.type === 'new_comment') {
    const newComment = message.data;

    // 즉시 화면 표시
    addBubble(newComment.content, false);

    // commentList에서 동일 ID 제거 → 중복 방지
    commentList = commentList.filter((c) => c.id !== newComment.id);

  } else if (message.type === 'delete_comment') {
    // 삭제된 댓글
    const { id } = message.data;
    // commentList에서 제거
    commentList = commentList.filter((c) => c.id !== id);
    // 이미 표시된 버블을 제거하고 싶다면 "id"와의 매핑 로직 추가
  }
});

ws.addEventListener('close', () => {
  console.log('[CLIENT] WebSocket disconnected.');
});

/***************************************
 * 5) 내가 쓴 댓글 즉시 표시 + 서버 전송
 ***************************************/
liveChatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const commentText = liveChatInput.value.trim();

  // 금칙어 체크
  const hasForbidden = forbiddenWords.some((word) => commentText.includes(word));
  if (hasForbidden) {
    showForbiddenAlert('금칙어가 포함된 메시지는 보낼 수 없습니다.');
    return;
  }

  // 내 댓글 즉시 표시
  addBubble(commentText, true);

  // 중복 방지 위해, content 같은 것 있으면 제거 (실제으론 "id" 비교가 더 안전)
  commentList = commentList.filter((c) => c.content !== commentText);

  // 서버에 POST
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentText }),
    });

    if (response.ok) {
      // 성공 → 입력창 초기화
      liveChatInput.value = '';
    } else if (response.status === 429) {
      showForbiddenAlert('메시지를 너무 자주 보냈습니다. 잠시 후 다시 시도하세요.');
    } else {
      showForbiddenAlert('댓글 추가에 실패했습니다.');
    }
  } catch (error) {
    console.error('댓글 추가 오류:', error);
    showForbiddenAlert('서버와 연결할 수 없습니다. 다시 시도해주세요.');
  }
});

/***************************************
 * 6) 페이지 로드 시 실행
 ***************************************/
fetchComments();
