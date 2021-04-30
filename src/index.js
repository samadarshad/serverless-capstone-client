import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
    <Router>
        <Auth0Provider
            domain="samadarshad.eu.auth0.com"
            clientId="VOJMJzaEytuFfdhvlzNf8GUwX5LSLZCv"
            redirectUri={window.location.origin}
        >
            <App />
        </Auth0Provider>,
    </Router>
    , document.querySelector('#root'));