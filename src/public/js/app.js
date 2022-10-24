const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("room", { payload: input.value }, (response) => {
        console.log(response.status)
    });
    console.log(input.value)
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);