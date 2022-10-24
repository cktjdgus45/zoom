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
    console.log(response.status)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

function addMessage(message) {
    const chat = document.querySelector('.room__chat');
    console.log(chat)
    const li = document.createElement('li');
    li.innerText = message;
    chat.appendChild(li);
}

socket.on("welcome", () => {
    addMessage("Someone joined")
});
