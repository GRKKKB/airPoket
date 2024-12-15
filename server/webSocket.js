const WebSocket = require('ws');
const clients = new Set();

module.exports = (WS_PORT) => {
  const wss = new WebSocket.Server({ port: WS_PORT });
  console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('새 클라이언트 연결됨');

    ws.on('message', (data) => {
      console.log('받은 메시지:', data);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('클라이언트 연결 종료됨');
    });

    ws.on('error', (error) => {
      console.error('WebSocket 에러:', error);
    });
  });

  return wss;
};
