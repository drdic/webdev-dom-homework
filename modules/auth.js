export function getToken() {
    return localStorage.getItem('token')
}

export function setToken(token) {
    localStorage.setItem('token', token)
}

export function removeToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
}

export function isLoggedIn() {
    return !!getToken()
}

export function getUserName() {
    return localStorage.getItem('userName')
}

export function setUserName(name) {
    localStorage.setItem('userName', name)
}

