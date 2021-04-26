import React, { useState, useEffect } from 'react'
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

const Chat = ({ socket, name, room, messages, users }) => {
    const [message, setMessage] = useState('')

    useEffect(() => {
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [socket])

    const sendMessage = (event) => {
        event.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => {
                setMessage('')
            })
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat