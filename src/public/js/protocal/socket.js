class Socket {
    #socket;
    constructor(url) {
        this.#socket = new WebSocket(url);
    }

    onOpen() {
        this.#socket.addEventListener('open', function () {
        })
    }
    onReceiveMessage(messageList) {
        this.#socket.addEventListener('message', async function (message) {
            const messageFromSocket = await message.data.text();
            const li = document.createElement('li');
            li.innerText = messageFromSocket;
            messageList.append(li);
        })
    }
    onClose() {
        console.log("connected with server is closed ! ");
    }
    sendMessage(message) {
        this.#socket.send(message);
    }
    send(type, data) {
        this.#socket.send(this.#makeMessage(type, data));
    }
    #makeMessage(type, payload) {
        const message = { type, payload };
        return JSON.stringify(message);
    }
}

export default Socket;