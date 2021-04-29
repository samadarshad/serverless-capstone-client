import React, { useState, useEffect } from 'react'
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

const Chat = ({ sendMessage, name, room, messages, users, deleteMessage }) => {
    const [message, setMessage] = useState('')

    // useEffect(() => {
    //     return () => {
    //         socket.emit('disconnect')
    //         socket.off()
    //     }
    // }, [socket])

    const send = (event) => {
        console.log("sending");
        event.preventDefault()

        if (message) {
            sendMessage(message)
            setMessage('')
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                {/* <InfoBar room={room} /> */}
                <Messages messages={messages} name={name} deleteMessage={deleteMessage} />
                <Input message={message} setMessage={setMessage} send={send} />
            </div>
            {/* <TextContainer users={users} /> */}
        </div>
    )
}

export default Chat