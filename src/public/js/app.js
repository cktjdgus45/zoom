const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
room.hidden = true;

let roomName;

function showRoom(response) {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('.room__title');
    roomTitle.innerText = `${roomName} Room`;
    const messageForm = room.querySelector("#message");
    const nameForm = room.querySelector("#name");
    messageForm.addEventListener('submit', handleMessageSubmit)
    nameForm.addEventListener('submit', handleNameSubmit)
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#message input');
    const value = input.value;
    socket.emit('new_message', value, roomName, () => addMessage(`You : ${value}`));
    input.value = '';
}
function handleNameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    const value = input.value;
    socket.emit('username', value);
    input.value = '';
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on("welcome", (username) => {
    addMessage(`${username} joined`)
});

socket.on("bye", (username) => {
    addMessage(`${username} left ㅠ`)
})

socket.on("new_message", (message) => {
    addMessage(message);
})



function addMessage(message) {
    const chat = document.querySelector('.room__chat');
    console.log(chat)
    const li = document.createElement('li');
    li.innerText = message;
    chat.appendChild(li);
}

