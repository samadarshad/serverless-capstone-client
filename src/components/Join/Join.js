import React, { useState } from 'react'
import './Join.css'


const Join = ({ signIn, nickname }) => {
    const [room, setRoom] = useState('')

    function joinRoom(event) {
        if (room) {
            event.preventDefault()
            signIn(room)
        }
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <p className="heading">{nickname}</p>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                <button className="button mt-20" type="submit" onClick={(event) => joinRoom(event)}>Join Room</button>
            </div>
        </div>
    )
}

export default Join