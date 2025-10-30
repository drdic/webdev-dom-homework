// const API_BASE_URL = 'https://wedev-api.sky.pro/api/v2'
// const PERSONAL_KEY = 'eduard-zakharevskiy'
// const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`

const API_BASE_URL = 'https://wedev-api.sky.pro/api/v2'
const PERSONAL_KEY = 'glebkaff'
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`

// export async function getComments() {
//     try {
//         const response = await fetch(API_URL)

//         // обработка статусов для GET запроса
//         if (response.status === 500) {
//             throw new Error('Сервер сломался, попробуй позже')
//         }

//         if (!response.ok) {
//             throw new Error(`Ошибка загрузки: ${response.status}`)
//         }

//         const data = await response.json()
//         return data.comments
//     } catch (error) {
//         console.error('Ошибка при загрузке комментариев:', error)
//         throw error // прокидываем ошибку дальше
//     }
// }

// export async function addComment(
//     { name, text, forceError = false },
//     retryCount = 0,
// ) {
//     const maxRetries = 2 // максимально 2 повторные попытки

//     try {
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             body: JSON.stringify({ name, text, forceError }),
//         })

//         // обработка HTTP статусов
//         if (response.status === 500) {

//             if (retryCount < maxRetries) {
//                 console.log(
//                     `Сервер вернул 500, повторяем попытку ${retryCount + 1}/${maxRetries}`,
//                 )

//                 await new Promise((resolve) => setTimeout(resolve, 1000))
//                 return addComment({ name, text, forceError }, retryCount + 1)
//             }
//             throw new Error('Сервер сломался, попробуй позже')
//         }

//         if (response.status === 400) {
//             throw new Error(
//                 'Имя и комментарий должны быть не короче 3 символов',
//             )
//         }

//         if (!response.ok) {
//             throw new Error(`Ошибка сервера: ${response.status}`)
//         }

//         return await response.json()
//     } catch (error) {
//         if (error.message === 'Failed to fetch' && retryCount < maxRetries) {
//             console.log(
//                 `Сетевая ошибка, повторяем попытку ${retryCount + 1}/${maxRetries}`,
//             )
//             await new Promise((resolve) => setTimeout(resolve, 1000))
//             return addComment({ name, text, forceError }, retryCount + 1)
//         }

//         console.error('Ошибка при добавлении комментария:', error)
//         throw error
//     }
// }

// Функция для получения заголовков с авторизацией
function getHeaders(withAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
    }

    if (withAuth) {
        const token = localStorage.getItem('token')
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    return headers
}

// Авторизация пользователя
export async function loginUser({ login, password }) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                login,
                password,
            }),
        })

        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }

        if (response.status === 500) {
            throw new Error('Сервер сломался, попробуйте позже')
        }

        if (!response.ok) {
            throw new Error(`Ошибка авторизации: ${response.status}`)
        }

        const data = await response.json()
        return data // { user: {}, token: '' }
    } catch (error) {
        console.error('Ошибка при авторизации:', error)
        throw error
    }
}

// Получение комментариев без токена
export async function getComments() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getHeaders(),
        })

        if (response.status === 500) {
            throw new Error('Сервер сломался, попробуйте позже')
        }

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()
        return data.comments
    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error)
        throw error
    }
}

// Добавление комментария - требует токен
export async function addComment({ text, forceError = false }) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getHeaders(true), // withAuth = true
            body: JSON.stringify({
                text,
                forceError,
            }),
        })

        // Обработка ошибок авторизации
        if (response.status === 401) {
            throw new Error('Ошибка авторизации. Войдите в систему')
        }

        if (response.status === 500) {
            throw new Error('Сервер сломался, попробуйте позже')
        }

        if (response.status === 400) {
            throw new Error('Комментарий должен быть не короче 3 символов')
        }

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Ошибка при добавлении комментария:', error)
        throw error
    }
}

// Регистрация пользователя - опционально, на будущее
export async function registerUser({ login, password, name }) {
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                login,
                password,
                name,
            }),
        })

        if (response.status === 400) {
            throw new Error('Пользователь уже существует')
        }

        if (!response.ok) {
            throw new Error(`Ошибка регистрации: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Ошибка при регистрации:', error)
        throw error
    }
}
