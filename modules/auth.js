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
    localStorage.removeItem('userName') //удаляем имя при выходе
}

export function isLoggedIn() {
    return !!getToken()
}

// Добавляем функции для работы с именем пользователя
export function getUserName() {
    return localStorage.getItem('userName')
}

export function setUserName(name) {
    localStorage.setItem('userName', name)
}

// функция для проверки валидности токена
// export async function validateToken() {
//     const token = getToken()
//     if (!token) return false

//     return true
// }
