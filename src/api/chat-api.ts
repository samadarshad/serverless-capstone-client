import Sockette from 'sockette';
const ENDPOINT = process.env.REACT_APP_ENDPOINT || `ws://localhost:3001`
const TOKEN = "2" //TODO make token from auth
const URL = `${ENDPOINT}?token=${TOKEN}`
interface JoinRoom {
    name: string
    room: string
}

class ChatApi {
    onMessage: (e: MessageEvent) => void
    ws!: Sockette

    constructor(onMessage: (e: MessageEvent) => void) {
        this.onMessage = onMessage;
    }

    connect() {
        return new Promise(resolve => {
            this.ws = new Sockette(URL, {
                timeout: 5e3,
                maxAttempts: 10,
                onopen: e => {
                    console.log('Connected!', e)
                    resolve('connected')
                },
                onmessage: e => {
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
        const payload = {
            action: "onJoin",
            ...joiningInfo
        }
        this.ws.json(payload)
    }


    sendMessageToRoom(message: string, room: string) {
        const payload = {
            action: "onMessage",
            subAction: "send",
            message,
            room
        }

        this.ws.json(payload)
    }

    deleteMessage(userId: string, postedAt: string, room: string) {
        const payload = {
            action: "onMessage",
            subAction: "delete",
            userId,
            postedAt,
            room
        }

        this.ws.json(payload)
    }
}
export default ChatApi