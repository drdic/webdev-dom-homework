// export function getToken() {
//     return localStorage.getItem('token')
// }

// export function setToken(token) {
//     localStorage.setItem('token', token)
// }

// export function removeToken() {
//     localStorage.removeItem('token')
// }

// export function isLoggedIn() {
//     return !!getToken()
// }

export function getToken() {
    return localStorage.getItem('token')
}

export function setToken(token) {
    localStorage.setItem('token', token)
}

export function removeToken() {
    localStorage.removeItem('token')
}

export function isLoggedIn() {
    return !!getToken()
}

// функция для проверки валидности токена
// export async function validateToken() {
//     const token = getToken()
//     if (!token) return false

//     return true
// }
