const call = document.getElementById('call');
const room = document.getElementById('room');
const roomForm = room.querySelector('form');
let roomName;
let myStream;
let myPeerConnection;
const socket = io();

socket.on('welcome', async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
})
socket.on("offer", async (offer) => {
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
})
socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
})

socket.on('ice', (ice) => {
    console.log("recieve ice candidate");
    myPeerConnection.addIceCandidate(ice);
})

call.hidden = true;

function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.addEventListener('icecandidate', handleIce);
    myPeerConnection.addEventListener('addstream', handleAddStream);
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
}

function handleAddStream(data) {
    console.log('got an event from my peer');
    const peersStream = document.getElementById('peersStream');
    peersStream.srcObject = data.stream;
}

function handleIce(data) {
    socket.emit('ice', data.candidate, roomName);
    console.log("send ice candidate");
}

async function startMedia() {
    room.hidden = true;
    call.hidden = false;
    await connectMediaStream();
    makeConnection();
}

async function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomForm.querySelector('input');
    await startMedia();
    socket.emit('join_room', input.value);
    roomName = input.value;
    input.value = '';
}

roomForm.addEventListener('submit', handleRoomSubmit);

const myFace = document.getElementById('myFace');
const camerasSelect = document.getElementById('cameras');


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
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection.getSenders().find(sender => sender.kind === 'video');
        videoSender.replaceTrack(videoTrack)
    }
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);