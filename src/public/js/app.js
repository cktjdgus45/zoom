const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
room.hidden = true;

let roomName;

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value;
    socket.emit('new_message', input.value, roomName, () => addMessage(`You : ${value}`));
    input.value = '';
}

function showRoom(response) {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('.room__title');
    roomTitle.innerText = `${roomName} Room`;
    const form = room.querySelector("form");
    form.addEventListener('submit', handleMessageSubmit)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on("welcome", () => {
    addMessage("Someone joined")
});

socket.on("bye", () => {
    addMessage("Someone left ㅠ")
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

