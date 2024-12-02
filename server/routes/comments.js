const express = require('express');
const router = express.Router();

let comments = []; // 메모리에 댓글 저장
const MAX_COMMENTS = 100; // 최대 저장 가능한 메시지 개수
const RATE_LIMIT_TIME = 5000; // 메시지 전송 제한 시간 (밀리초)
const rateLimit = {}; // 사용자별 메시지 전송 제한 정보

module.exports = (wss) => {
  // 댓글 목록 가져오기
  router.get('/', (req, res) => {
    res.json(comments);
  });

  // 댓글 추가
  router.post('/', (req, res) => {
    const { comment } = req.body;
    const userIP = req.ip; // 사용자의 IP 주소

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ success: false, message: '댓글 내용이 비어 있습니다.' });
    }

    // 메시지 전송 속도 제한 확인
    const now = Date.now();
    if (rateLimit[userIP] && now - rateLimit[userIP] < RATE_LIMIT_TIME) {
      return res.status(429).json({ success: false, message: '메시지를 너무 자주 보냈습니다. 잠시 후에 시도하세요.' });
    }

    // 메시지 전송 시간 갱신
    rateLimit[userIP] = now;

    // 새 댓글 생성
    const newComment = {
      id: comments.length + 1,
      content: comment.trim(),
      createdAt: new Date(),
    };

    // 배열에 새 댓글 추가
    comments.push(newComment);

    // 메시지가 MAX_COMMENTS 초과 시 오래된 메시지 제거
    if (comments.length > MAX_COMMENTS) {
      comments.shift(); // 배열에서 가장 오래된 메시지 제거
    }

    // WebSocket을 통해 새 댓글을 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === require('ws').OPEN) {
        client.send(JSON.stringify({ type: 'new_comment', data: newComment }));
      }
    });

    res.status(201).json({ success: true, comment: newComment });
  });

  return router;
};
