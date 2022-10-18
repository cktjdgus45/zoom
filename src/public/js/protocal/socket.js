class Socket {
    #socket;
    constructor(url) {
        this.#socket = new WebSocket(url);
    }

    onOpen() {
        this.#socket.addEventListener('open', function () {
            this.send('Hello Server!');
        })
    }
    onReceiveMessage() {
        this.#socket.addEventListener('message', async function (message) {
            const messageFromSocket = await message.data.text();
            console.log(messageFromSocket);
        })
    }
    onClose() {
        console.log("connected with server is closed ! ");
    }
    sendMessage(message) {
        this.#socket.send(message);
    }
}

export default Socket;