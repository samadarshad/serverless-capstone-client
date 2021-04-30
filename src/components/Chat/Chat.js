import React, { useState, useEffect } from 'react'
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

const Chat = ({ sendMessage, name, room, messages, deleteMessage }) => {
    const [message, setMessage] = useState('')

    const send = (event) => {
        event.preventDefault()

        if (message) {
            sendMessage(message)
            setMessage('')
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} deleteMessage={deleteMessage} />
                <Input message={message} setMessage={setMessage} send={send} />
            </div>
        </div>
    )
}

export default Chat