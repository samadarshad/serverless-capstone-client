import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Route } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import ChatApi from './api/chat-api'

const chatApi = new ChatApi((e) => console.log('Received:', e))

const App = () => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])

    let history = useHistory();



    useEffect(() => {
        async function connectToChat() {
            await chatApi.connect()
            console.log("now sending msg");
            chatApi.sendMessageToRoom("sup")
        }
        connectToChat()
    }, [])

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


    // function signIn({ name, room }) {
    //     socket.emit('join', { name, room }, (error) => {
    //         if (error) {
    //             alert(error)
    //         } else {
    //             setName(name)
    //             setRoom(room)
    //             history.push('/chat')
    //         }
    //     })
    // }

    return (
        <>
            {/* <Route path="/" exact render={() => <Join signIn={signIn} users={users} />} /> */}
            {/* <Route path="/chat" render={() => <Chat socket={socket} name={name} room={room} messages={messages} users={users} />} /> */}
        </>
    )
}

export default App