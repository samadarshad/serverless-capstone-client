import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { MessageType } from '../../models/MessageType'
import Message from '../Message/Message'

import './Messages.css'

const sortByPostedAt = (a: MessageType, b: MessageType) => (a.postedAt > b.postedAt) ? 1 : -1
const Messages = ({ messages, myUserId, deleteMessage }: { messages: MessageType[], myUserId: string, deleteMessage: Function }) => {

    const sortedMessages = messages.sort(sortByPostedAt) //TODO sort this at the API, so it doesnt keep recalculating at every render
    return (
        <ScrollToBottom className="messages" debug={false}>
            {sortedMessages.map((message, i) => <div key={i}>
                <Message messageItem={message} myUserId={myUserId} deleteMessage={() => deleteMessage(message)} />
            </div>)}
        </ScrollToBottom>
    )
}

export default Messages;