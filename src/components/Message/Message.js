import React from 'react'
import ReactEmoji from 'react-emoji'

import './Message.css'

const displayMessage = ({ message, isDeleted }) => {
    if (isDeleted) {
        return <i>Message has been deleted.</i>
    } else {
        return ReactEmoji.emojify(message)
    }
}

const currentUserMessage = (message, deleteMessage) => (
    <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{message.name}</p>
        <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{displayMessage(message)}</p>
        </div>
        {(!message.isDeleted) ?
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