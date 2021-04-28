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
    const [messages, setMessages] = useState<MessageType[]>([])
    const [users, setUsers] = useState([])

    let history = useHistory();

    function addMessage(newMessage: MessageType) {
        setMessages(messages => [...messages, newMessage])
    }

    async function connectToChat() {
        chatApi = new ChatApi((e) => {
            const msg = JSON.parse(e.data)
            console.log('Received message:', msg)
            if (MessageTypeChecker.test(msg)) {
                console.log('Received message of MessageType')
                addMessage(msg)
            } else {
                console.log('Error! Did not recieve MessageType')
            }
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

    // useEffect(() => {
    //     // socket.on('roomData', ({ users }) => {
    //     //     setUsers(users)
    //     // })

    //     socket.on('allUsers', ({ users }) => {
    //         setUsers(users)
    //         console.log("allUsers", users);
    //     })

    //     joinLobby()

    // }, [])

    // function joinLobby() {
    //     socket.emit('onLobby')
    // }

    const deleteMessage = (message: MessageType) => {
        chatApi.deleteMessage(message.userId, message.postedAt, message.room)
    }


    function signIn({ name, room }: JoinRoomType) {
        // console.log("signing in as", name, room);
        const joiningInfo = {
            name,
            room
        }
        chatApi.joinRoom(joiningInfo)
        // socket.emit('join', { name, room }, (error) => {
        //     if (error) {
        //         alert(error)
        //     } else {
        setName(name)
        setRoom(room)
        //         history.push('/chat')
        //     }
        // })
    }

    return (
        <>
            <Route path="/" exact render={() => <Join signIn={(d: JoinRoomType) => signIn(d)} users={users} />} />
            {/* <Route path="/chat" render={() => <Chat sendMessage={(msg) => chatApi.sendMessageToRoom(msg)} name={name} room={room} messages={messages} users={users} />} /> */}
            <Chat sendMessage={(text: string) => sendMessage(text)} name={name} room={room} messages={messages} users={users} deleteMessage={deleteMessage} />
        </>
    )
}

export default App