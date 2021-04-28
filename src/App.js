import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import ChatApi from './api/chat-api'
import Message from './components/Message/Message';
import { createCheckers } from "ts-interface-checker";
import MessageTypeTI from "../../../requests/generated/MessageType-ti";
const { MessageType } = createCheckers(MessageTypeTI)

let chatApi

const App = () => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])

    let history = useHistory();

    function addMessage(newMessage) {
        setMessages(messages => [...messages, newMessage])
    }

    async function connectToChat() {
        chatApi = new ChatApi((e) => {
            const msg = JSON.parse(e.data)
            console.log('Received message:', msg)
            if (MessageType.test(msg)) {
                addMessage(msg)
            }
        })
        await chatApi.connect()
    }


    useEffect(() => {
        connectToChat()

        setName("i23wz")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendMessage = (message) => {
        chatApi.sendMessageToRoom(message, room)
    }

    useEffect(() => {
        console.log('messages:', JSON.stringify(messages, null, 2))
    }, [messages])

    // useEffect(() => {
    //     socket.on('message', (message) => {
    //         setMessages(messages => [...messages, message])
    //     })

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


    function signIn({ name, room }) {
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
            <Route path="/" exact render={() => <Join signIn={(d) => signIn(d)} users={users} />} />
            {/* <Route path="/chat" render={() => <Chat sendMessage={(msg) => chatApi.sendMessageToRoom(msg)} name={name} room={room} messages={messages} users={users} />} /> */}
            <Chat sendMessage={(message) => sendMessage(message)} name={name} room={room} messages={messages} users={users} />
        </>
    )
}

export default App