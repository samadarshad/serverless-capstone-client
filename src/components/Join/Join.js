import React, { useState } from 'react'
import './Join.css'
import TextContainer from '../TextContainer/TextContainer'

const Join = ({ signIn, users }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')

    function joinRoom(event) {
        if (name && room) {
            event.preventDefault()
            signIn({ name, room })
        }
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                <button className="button mt-20" type="submit" onClick={(event) => joinRoom(event)}>Sign In</button>
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Join