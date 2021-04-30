import React, { useState, useEffect } from 'react'
import './Join.css'
import { useAuth0 } from "@auth0/auth0-react";



const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getUserMetadata = async () => {
            const domain = "samadarshad.eu.auth0.com";

            try {
                const accessToken = await getAccessTokenSilently({
                    audience: `https://${domain}/api/v2/`
                });
                console.log(`Bearer ${accessToken}`);
            } catch (e) {
                console.log(e.message);
            }
        };

        getUserMetadata();
    }, []);

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};

const Join = ({ signIn }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [token, setToken] = useState('')
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    function joinRoom(event) {
        if (name && room) {
            event.preventDefault()
            signIn({ name, room })
        }
    }

    function authorize(event) {

    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput mt-20" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                <button className="button mt-20" type="submit" onClick={(event) => joinRoom(event)}>Join Room</button>
            </div>
        </div>
    )
}

export default Join