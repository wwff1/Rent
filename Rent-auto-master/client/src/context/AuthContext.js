import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    tokenId: null,
    userId: null,
    accessToken: null,
    googleId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})