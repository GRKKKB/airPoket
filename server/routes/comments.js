// routes/comments.js
const express = require('express');
const router = express.Router();

let comments = [{"id":1,"content":"점수 체크 완료~","createdAt":"2024-12-05T07:15:12.380Z"}
  ,{"id":2,"content":"실시간 경기도 오늘 작업 중단","createdAt":"2024-12-05T07:15:12.380Z"}
  ,{"id":3,"content":"울산 내일도 심한가??","createdAt":"2024-12-05T07:15:12.380Z"}
  ,{"id":4,"content":"실시간 평택 아 마스크 안챙겼어요 ㅠㅠ","createdAt":"2024-12-05T07:15:12.380Z"}]; // 메모리에 댓글 저장
const MAX_COMMENTS = 10;
const RATE_LIMIT_TIME = 5000;
const rateLimit = {};

module.exports = (wss) => {
  router.get('/', (req, res) => {
    res.json(comments);
  });

  router.post('/', (req, res) => {
    const { comment } = req.body;
    const userIP = req.ip;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ success: false, message: '댓글 내용이 비어 있습니다.' });
    }

    const now = Date.now();
    if (rateLimit[userIP] && now - rateLimit[userIP] < RATE_LIMIT_TIME) {
      return res.status(429).json({ success: false, message: '메시지를 너무 자주 보냈습니다. 잠시 후에 시도하세요.' });
    }

    rateLimit[userIP] = now;

    const newComment = {
      id: comments.length + 1,
      content: comment.trim(),
      createdAt: new Date(),
    };

    comments.push(newComment);

    if (comments.length > MAX_COMMENTS) {
      const removedComment = comments.shift(); // 오래된 댓글 제거
      // WebSocket으로 제거된 댓글 ID 브로드캐스트
      wss.clients.forEach((client) => {
        if (client.readyState === require('ws').OPEN) {
          client.send(
            JSON.stringify({
              type: 'delete_comment',
              data: { id: removedComment.id },
            })
          );
        }
      });
    }

    wss.clients.forEach((client) => {
      if (client.readyState === require('ws').OPEN) {
        client.send(JSON.stringify({ type: 'new_comment', data: newComment }));
      }
    });

    res.status(201).json({ success: true, comment: newComment });
  });

  return router;
};
