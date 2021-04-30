import React, { useState } from 'react'
import './Join.css'
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="button" onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button className="button mt-20" onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
        </button>
    );
};

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

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

                {!token ?
                    <>
                        <h1 className="heading">Chat App</h1>
                        < LoginButton />
                        < LogoutButton />
                        <Profile />
                        {/* <button className="button" type="submit" onClick={(event) => authorize(event)}>Sign In</button> */}
                    </>
                    :
                    <>
                        <h1 className="heading">Join</h1>
                        <div><input placeholder="Name" className="joinInput mt-20" type="text" onChange={(event) => setName(event.target.value)} /></div>
                        <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                        <button className="button mt-20" type="submit" onClick={(event) => joinRoom(event)}>Join Room</button>
                    </>
                }

            </div>
        </div>
    )
}

export default Join