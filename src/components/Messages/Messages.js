import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from '../Message/Message'

import './Messages.css'

const Messages = ({ messages, name, deleteMessage }) => (
    <ScrollToBottom className="messages" debug={false}>
        {messages.map((message, i) => <div key={i}>
            <Message messageItem={message} myName={name} deleteMessage={deleteMessage(message)} />
        </div>)}
    </ScrollToBottom>
)

export default Messages;