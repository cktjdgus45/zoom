// WebSocket 연결 생성
const socket = new WebSocket(`ws://${window.location.host}`);

// 연결이 열리면
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// 메시지 수신
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

socket.addEventListener('close', function (evnet) {
    console.log("connected with server is closed ! ");
})