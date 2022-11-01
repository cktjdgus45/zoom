const call = document.getElementById('call');
const room = document.getElementById('room');
const roomForm = room.querySelector('form');
let roomName;
const socket = io();

socket.on('welcome', () => {
    console.log('some one joined the room');
})

call.hidden = true;
function startMedia() {
    room.hidden = true;
    call.hidden = false;
    connectMediaStream();
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomForm.querySelector('input');
    socket.emit('join_room', input.value, startMedia);
    roomName = input.value;
    input.value = '';
}

roomForm.addEventListener('submit', handleRoomSubmit);

const myFace = document.getElementById('myFace');
const camerasSelect = document.getElementById('cameras');

let myStream;

async function addCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option);
        })
    } catch (error) {
        console.log(error)
    }
}
async function connectMediaStream(deviceId) {
    const constraints = deviceId ? {
        audio: true,
        video: { facingMode: "user" }
    } : {
        audio: true,
        video: {
            deviceId: {
                exact: deviceId
            }
        }
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(constraints);
        myFace.srcObject = myStream;
        if (!deviceId) {
            await addCameras();
        }
    } catch (error) {
        console.log(error);
    }
}

const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
let muted = false;
let cameraOff = false;

function handleMuteClick() {
    myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    if (!muted) {
        muteBtn.innerText = "Unmute"
        muted = true;
    } else {
        muteBtn.innerText = "Mute"
        muted = false;
    }
}
function handleCameraClick() {
    myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off"
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On"
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await connectMediaStream(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);