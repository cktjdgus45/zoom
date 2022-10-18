import Socket from './protocal/socket.js';

// WebSocket 연결 생성
const socket = new Socket(`ws://${window.location.host}`);

// 연결이 열리면
socket.onOpen();

// 메시지 수신
socket.onReceiveMessage();

//연결이 끓기면
socket.onClose();