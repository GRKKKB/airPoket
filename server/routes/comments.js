const express = require('express');
const router = express.Router();

let comments = []; // 메모리에 댓글 저장

module.exports = (wss) => {
  // 댓글 목록 가져오기
  router.get('/', (req, res) => {
    res.json(comments);
  });

  // 댓글 추가
  router.post('/', (req, res) => {
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ success: false, message: '댓글 내용이 비어 있습니다.' });
    }

    const newComment = { id: comments.length + 1, content: comment.trim(), createdAt: new Date() };
    comments.push(newComment);

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
