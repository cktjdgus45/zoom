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
        this.#socket.addEventListener('message', function (event) {
            console.log('Message from server', event.data);
        })
    }
    onClose() {
        console.log("connected with server is closed ! ");
    }
}

export default Socket;