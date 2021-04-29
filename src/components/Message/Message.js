import React from 'react'
import ReactEmoji from 'react-emoji'

import './Message.css'

const displayMessage = ({ message, subAction }) => {
    switch (subAction) {
        case "send":
            return ReactEmoji.emojify(message)
        case "delete":
            return <i>Message has been deleted.</i>
        default:
            return null
    }
}

const currentUserMessage = (message, deleteMessage) => (
    <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{message.name}</p>
        <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{displayMessage(message)}</p>
        </div>
        {(message.subAction !== "delete") ?
            <button onClick={() => deleteMessage()}>Delete</button>
            :
            null
        }

    </div>
)

const otherUsersMessage = (message) => (
    <div className="messageContainer justifyStart">

        <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{displayMessage(message)}</p>
        </div>
        <p className="sentText pl-10">{message.name}</p>
    </div>
)

const Message = ({ messageItem, myName, deleteMessage }) => {
    let isSendByCurrentUser = false

    const trimmedName = myName.trim().toLowerCase()

    if (messageItem.name === trimmedName) {
        isSendByCurrentUser = true
    }

    return (
        isSendByCurrentUser
            ? (
                currentUserMessage(messageItem, deleteMessage)
            )
            : (
                otherUsersMessage(messageItem)
            )
    )
}

export default Message;