import { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import ChatApi from './api/chat-api'
import { createCheckers } from "ts-interface-checker";
import MessageTypeTI from "./models/generated/MessageType-ti";
import { MessageType } from './models/MessageType';
import { useAuth0 } from "@auth0/auth0-react";

import './App.css'

const { MessageType: MessageTypeChecker } = createCheckers(MessageTypeTI)



let chatApi: ChatApi

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

    let history = useHistory();

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

    async function connectToChat() {
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

        chatApi = new ChatApi(onMessageEvent, accessToken)
        await chatApi.connect()
    }

    useEffect(() => {
        if (isAuthenticated) {
            connectToChat()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    const sendMessage = (message: string) => {
        chatApi.sendMessageToRoom(message, room, user.nickname)
    }

    useEffect(() => {
        console.log('messages:', JSON.stringify(messages, null, 2))
    }, [messages])

    const deleteMessage = (message: MessageType) => {
        chatApi.deleteMessage(message.userId, message.postedAt, message.room)
    }

    function signIn(room) {
        setRoom(room)
    }

    const joinRoom = async () => {
        chatApi.joinRoom({
            name: user.nickname,
            room
        })

        history.push('/chat')
    };

    useEffect(() => {
        if (isAuthenticated && room) {
            joinRoom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);


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
                    <Route path="/chat" render={() => <Chat sendMessage={(text: string) => sendMessage(text)} myUserId={user.sub} room={room} messages={messages} deleteMessage={deleteMessage} />} />
                </>
            }
        </>
    )
}

export default App