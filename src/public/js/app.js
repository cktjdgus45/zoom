const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
const nameContainer = document.getElementById('username');
room.hidden = true;
welcome.hidden = true;

let roomName;

const nameForm = nameContainer.querySelector("#name");
nameForm.addEventListener('submit', handleNameSubmit);

function handleNameSubmit(event) {
    event.preventDefault();
    const input = nameForm.querySelector('input');
    const value = input.value;
    socket.emit('username', value, showWelcome);
    input.value = '';
}
function showWelcome(response) {
    nameContainer.hidden = true;
    welcome.hidden = false;
    const userTitle = welcome.querySelector('.welcome__username');
    userTitle.innerText = `welcome! ${response.username}!`;
}
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value;
    socket.emit('new_message', value, roomName, () => addMessage(`You : ${value}`));
    input.value = '';
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    const value = input.value;
    socket.emit("enter_room", value, showRoom);
    roomName = input.value;
    input.value = '';
}

function showRoom(response) {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('.room__title');
    roomTitle.innerText = `${roomName} Room`;
    const messageForm = room.querySelector("#message");
    messageForm.addEventListener('submit', handleMessageSubmit);
}
form.addEventListener('submit', handleRoomSubmit);

socket.on("welcome", (username, userCount) => {
    addMessage(`${username} joined`);
    const roomTitle = room.querySelector('.room__title');
    roomTitle.innerText = `${roomName} Room (${userCount})`;
});

socket.on("bye", (username, userCount) => {
    addMessage(`${username} left ㅠ`);
    const roomTitle = room.querySelector('.room__title');
    roomTitle.innerText = `${roomName} Room (${userCount})`;
})

socket.on("new_message", (message) => {
    addMessage(message);
})

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector('.welcome__rooms-list');
    roomList.innerHTML = "";
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.appendChild(li);
    })
});



function addMessage(message) {
    const chat = document.querySelector('.room__chat');
    console.log(chat)
    const li = document.createElement('li');
    li.innerText = message;
    chat.appendChild(li);
}

