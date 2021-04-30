import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import ChatApi from './api/chat-api'
import Message from './components/Message/Message';
import { createCheckers } from "ts-interface-checker";
import MessageTypeTI from "./models/generated/MessageType-ti";
import { MessageType } from './models/MessageType';
import { JoinRoomType } from './models/JoinRoomType';
const { MessageType: MessageTypeChecker } = createCheckers(MessageTypeTI)

let chatApi: ChatApi

const App = () => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [action, setAction] = useState('')
    const [messages, setMessages] = useState<MessageType[]>([])

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
        updatedMessages[index] = newMessage
        setMessages(updatedMessages)
    }

    function handleMessageAction(message: MessageType) {
        if (message.isDeleted || message.modifiedAt) {
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
        chatApi = new ChatApi((e) => {
            console.log('Message!', e);

            const msg = JSON.parse(e.data)
            console.log('Received message:', msg)
            setAction(msg)
        })
        await chatApi.connect()
    }

    useEffect(() => {
        connectToChat()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendMessage = (message: string) => {
        chatApi.sendMessageToRoom(message, room)
    }

    useEffect(() => {
        console.log('messages:', JSON.stringify(messages, null, 2))
    }, [messages])

    const deleteMessage = (message: MessageType) => {
        chatApi.deleteMessage(message.userId, message.postedAt, message.room)
    }

    function signIn({ name, room }: JoinRoomType) {
        const joiningInfo = {
            name,
            room
        }
        chatApi.joinRoom(joiningInfo)
        setName(name)
        setRoom(room)
        history.push('/chat')
    }

    return (
        <>
            <Route path="/" exact render={() => <Join signIn={(d: JoinRoomType) => signIn(d)} />} />
            <Route path="/chat" render={() => <Chat sendMessage={(text: string) => sendMessage(text)} name={name} room={room} messages={messages} deleteMessage={deleteMessage} />} />
        </>
    )
}

export default App