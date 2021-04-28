import Sockette from 'sockette';
const ENDPOINT = process.env.REACT_APP_ENDPOINT || `ws://localhost:3001`
const TOKEN = "2" //TODO make token from auth
const URL = `${ENDPOINT}?token=${TOKEN}`
interface JoinRoom {
    name: string
    room: string
}

class ChatApi {
    onMessage: (e: Event) => void
    ws!: Sockette
    // socket!: WebSocket

    constructor(onMessage: (e: Event) => void) {
        this.onMessage = onMessage;
    }

    connect() {
        return new Promise(resolve => {
            // this.socket = new WebSocket(ENDPOINT)

            // this.socket.addEventListener('open', () => resolve('connected'))
            // this.socket.addEventListener('message', (e) => this.onMessage(e))

            this.ws = new Sockette(URL, {
                timeout: 5e3,
                maxAttempts: 10,
                onopen: e => {
                    console.log('Connected!', e)
                    resolve('connected')
                },
                onmessage: e => {
                    // console.log('Received:', e)
                    this.onMessage(e)
                },
                onreconnect: e => console.log('Reconnecting...', e),
                onmaximum: e => console.log('Stop Attempting!', e),
                onclose: e => console.log('Closed!', e),
                onerror: e => console.log('Error:', e)
            });
            console.log("ws: ", this.ws);

        })
    }



    joinRoom(joiningInfo: JoinRoom) {

        console.log("joinRoom in as", joiningInfo,);

        const payload = { "action": "onJoin", ...joiningInfo }
        this.ws.json(payload)
        // socket.emit('join', { name, room }, (error) => {
        //     if (error) {
        //         alert(error)
        //     } else {
        // setName(joiningInfo.name)
        // setRoom(joiningInfo.room)
        //         history.push('/chat')
        //     }
        // })
    }

    test() {
        console.log("ws", this.ws);
    }

    sendMessageToRoom(message: string, room: string) {
        console.log("sending message to room", message, room);
        console.log("ws", this.ws);

        const payload = { "action": "onMessage", message, room }
        this.ws.json(payload)

        // this.socket.send(JSON.stringify(payload))
    }


}

export default ChatApi