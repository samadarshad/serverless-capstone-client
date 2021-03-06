import React from 'react'

import onlineIcon from '../../icons/onlineIcon.png'

import './TextContainer.css'

const TextContainer = ({ users }) => (
    <div className="textContainer">
        {
            users
                ? (
                    <div>
                        <h1>People currently chatting:</h1>
                        <div className="activeContainer">
                            <h2>
                                {users.map(({ name, room }) => (
                                    <div key={name} className="activeItem">
                                        {name} in room {room}
                                        <img alt="Online Icon" src={onlineIcon} />
                                    </div>
                                ))}
                            </h2>
                        </div>
                    </div>

                )
                : null
        }
    </div>
)

export default TextContainer