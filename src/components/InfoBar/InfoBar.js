import React from 'react'
import closeIcon from '../../icons/closeIcon.png'
import onlineIcon from '../../icons/onlineIcon.png'
import './InfoBar.css'

const InfoBar = ({ leaveRoom, room }) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <img className="onlineIcon" src={onlineIcon} alt="online" />
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <button
                style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}
                onClick={() => leaveRoom()}><img src={closeIcon} alt="close" /></button>
        </div>
    </div>
)


export default InfoBar;