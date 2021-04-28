import React from 'react'
import ReactEmoji from 'react-emoji'

import './Message.css'

const Message = ({ messageItem: { name, message }, myName, deleteMessage }) => {
    let isSendByCurrentUser = false

    const trimmedName = myName.trim().toLowerCase()

    if (name === trimmedName) {
        isSendByCurrentUser = true
    }

    return (
        isSendByCurrentUser
            ? (
                <div className="messageContainer justifyEnd">
                    <p className="sentText pr-10">{trimmedName}</p>
                    <div className="messageBox backgroundBlue">
                        <p className="messageText colorWhite">{ReactEmoji.emojify(message)}</p>
                    </div>
                    <button onClick={() => deleteMessage()}>Delete</button>
                </div>
            )
            : (
                <div className="messageContainer justifyStart">

                    <div className="messageBox backgroundLight">
                        <p className="messageText colorDark">{ReactEmoji.emojify(message)}</p>
                    </div>
                    <p className="sentText pl-10">{name}</p>
                </div>
            )
    )
}

export default Message;