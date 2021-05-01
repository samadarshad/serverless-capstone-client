import { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import { createCheckers } from "ts-interface-checker";
import MessageTypeTI from "./models/generated/MessageType-ti";
import { MessageType } from './models/MessageType';
import { useAuth0 } from "@auth0/auth0-react";
import './App.css'

import Sockette from 'sockette';
// const ENDPOINT = process.env.REACT_APP_ENDPOINT || `ws://localhost:3001`
const ENDPOINT = `wss://jyvmqrh1c5.execute-api.eu-west-2.amazonaws.com/dev`

const { MessageType: MessageTypeChecker } = createCheckers(MessageTypeTI)

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="button" onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button className="button mt-20" onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
        </button>
    );
};

const App = () => {
    const [room, setRoom] = useState('')
    const [action, setAction] = useState('')
    const [messages, setMessages] = useState<MessageType[]>([])
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [ws, setWs] = useState<Sockette>()

    let history = useHistory();


    const connect = async () => {

        const onMessageEvent = (e: MessageEvent) => {
            console.log('Message!', e);

            const msg = JSON.parse(e.data)
            console.log('Received message:', msg)
            setAction(msg)
        }

        const domain = "samadarshad.eu.auth0.com";
        const accessToken = await getAccessTokenSilently({
            audience: `https://${domain}/api/v2/`
        });

        const URL = `${ENDPOINT}?token=${accessToken}`
        let newWs
        await new Promise(resolve => {
            newWs = new Sockette(URL, {
                timeout: 5e3,
                maxAttempts: 10,
                onopen: e => {
                    console.log('Connected!', e)
                    resolve('connected')
                },
                onmessage: e => {
                    onMessageEvent(e)
                },
                onreconnect: e => console.log('Reconnecting...', e),
                onmaximum: e => console.log('Stop Attempting!', e),
                onclose: e => console.log('Closed!', e),
                onerror: e => console.log('Error:', e)
            });
            console.log("ws: ", newWs);

        })
        setWs(newWs)
    }

    useEffect(() => {
        handleMessageEvent(action)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    function addMessage(newMessage: MessageType) {
        setMessages(messages => [...messages, newMessage])
    }

    const messageEquals = (a: MessageType, b: MessageType) => {
        return ((a.postedAt === b.postedAt) && (a.userId === b.userId) && (a.room === b.room))
    }

    const updateMessage = (newMessage: MessageType) => {
        const index = messages.findIndex((m) => messageEquals(m, newMessage))
        if (index < 0) {
            console.log("Cannot find message", newMessage);
            return
        }

        let updatedMessages = [...messages]
        if (newMessage.modifiedAt !== updatedMessages[index].modifiedAt) {
            updatedMessages[index] = newMessage
            setMessages(updatedMessages)
        }

    }

    function handleMessageAction(message: MessageType) {
        if (message.modifiedAt !== message.postedAt) {
            updateMessage(message)
        } else {
            addMessage(message)
        }
    }

    function handleMessageEvent(msg) {
        if (MessageTypeChecker.test(msg)) {
            handleMessageAction(msg)
        } else {
            console.log('Did not recieve MessageType')
        }
    }

    const joinRoom = (room) => {
        const payload = {
            action: "onJoin",
            room,
            name: user.nickname
        }
        console.log("joining", ws);

        ws?.json(payload)

        history.push('/chat')
    }


    const sendMessage = (message: string) => {
        const payload = {
            action: "onMessage",
            message,
            room,
            name: user.nickname
        }

        ws?.json(payload)
    }

    const deleteMessage = ({ userId, postedAt, room }) => {
        const payload = {
            action: "onMessage",
            isDeleted: true,
            userId,
            postedAt,
            room
        }

        ws?.json(payload)
    }

    useEffect(() => {
        if (isAuthenticated) {
            console.log("connecting...");
            connect()
            // connectToChat()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    function signIn(room) {
        setRoom(room)

        if (isAuthenticated && room) {
            joinRoom(room);
        }
    }



    const leaveRoom = async () => {
        const payload = {
            action: "onJoin",
            room: '_lobby',
            name: user.nickname
        }
        console.log("leaving", ws);

        ws?.json(payload)



        setMessages([])

        history.push('/')

        setRoom('_lobby')
    };



    return (
        <>
            {!isAuthenticated ?
                <>
                    <div className="joinOuterContainer">
                        <div className="joinInnerContainer">
                            <h1 className="heading">Chat App</h1>
                            < LoginButton />
                        </div>
                    </div>

                </>
                :
                <>
                    <div className="appOuterContainer">
                        <div className="appInnerContainer">
                            < LogoutButton />
                        </div>
                    </div>

                    <Route path="/" exact render={() => <Join nickname={user.nickname} signIn={(room) => signIn(room)} />} />
                    <Route path="/chat" render={() => <Chat leaveRoom={leaveRoom} sendMessage={(text: string) => sendMessage(text)} myUserId={user.sub} room={room} messages={messages} deleteMessage={deleteMessage} />} />
                </>
            }
        </>
    )
}

export default App