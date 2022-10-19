import Socket from './protocal/socket.js';

// WebSocket 연결 생성
const socket = new Socket(`ws://${window.location.host}`);

// 연결이 열리면
socket.onOpen();

// 메시지 수신
const messageList = document.querySelector('ul');
socket.onReceiveMessage(messageList);

//연결이 끓기면
socket.onClose();

const messageForm = document.querySelector('#message');
const nickNameForm = document.querySelector('#nickName');
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send("new_message", input.value);
    input.value = "";
}
function handleNickNameSubmit(event) {
    event.preventDefault();
    const input = nickNameForm.querySelector("input");
    socket.send("nickname", input.value);
    input.value = "";
}
messageForm.addEventListener('submit', handleMessageSubmit);
nickNameForm.addEventListener('submit', handleNickNameSubmit);
