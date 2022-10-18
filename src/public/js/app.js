import Socket from './protocal/socket.js';

// WebSocket 연결 생성
const socket = new Socket(`ws://${window.location.host}`);

// 연결이 열리면
socket.onOpen();

// 메시지 수신
socket.onReceiveMessage();

//연결이 끓기면
socket.onClose();

const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.sendMessage(input.value);
    input.value = "";
}

messageForm.addEventListener('submit', handleSubmit);
