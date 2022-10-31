const socket = io();

const myFace = document.getElementById('myFace');

let myStream;

async function addCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const camerasSelect = document.getElementById('cameras');
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
async function connectMediaStream() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        myFace.srcObject = myStream;
    } catch (error) {
        console.log(error);
    }
}

connectMediaStream();
addCameras();

const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
let muted = false;
let cameraOff = false;

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);

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