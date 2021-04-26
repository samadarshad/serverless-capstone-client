import Sockette from 'sockette';
const ENDPOINT = process.env.REACT_APP_ENDPOINT || `ws://localhost:3001`

class ChatApi {
    onMessage: (e: Event) => void
    ws!: Sockette

    constructor(onMessage: (e: Event) => void) {
        this.onMessage = onMessage;
    }

    connect() {
        return new Promise(resolve => {
            this.ws = new Sockette(ENDPOINT, {
                timeout: 5e3,
                maxAttempts: 10,
                onopen: e => {
                    console.log('Connected!', e)
                    resolve('connected')
                },
                onmessage: e => console.log('Received:', e),
                onreconnect: e => console.log('Reconnecting...', e),
                onmaximum: e => console.log('Stop Attempting!', e),
                onclose: e => console.log('Closed!', e),
                onerror: e => console.log('Error:', e)
            });
        })
    }

    joinLobby() {

    }

    joinRoom() {

    }

    sendMessageToRoom(message: string) {
        const payload = { "action": "onMessage", "message": message }
        this.ws.json(payload)
    }


}

export default ChatApi