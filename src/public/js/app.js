const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
room.hidden = true;

let roomName;

function showRoom(response) {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('.room_title');
    roomTitle.innerText = `${roomName} Room`;
    console.log(response.status)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", { payload: input.value }, showRoom);
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

