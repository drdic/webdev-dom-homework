const API_BASE_URL = 'https://wedev-api.sky.pro/api/v2'
const PERSONAL_KEY = 'eduard-zakharevskiy'
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`
const authHost = 'https://wedev-api.sky.pro/api/user'

let token = ''

export const setToken = (newToken) => {
    token = newToken
}

export async function getComments() {
    try {
        const response = await fetch(API_URL)

        // обработка статусов для GET запроса
        if (response.status === 500) {
            throw new Error('Сервер сломался, попробуй позже')
        }

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()
        return data.comments
    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error)
        throw error // прокидываем ошибку дальше
    }
}

export async function addComment(
    { name, text, forceError = false },
    retryCount = 0,
) {
    const maxRetries = 2 // максимально 2 повторные попытки

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, text, forceError }),
        })

        // обработка HTTP статусов
        if (response.status === 500) {
            if (retryCount < maxRetries) {
                console.log(
                    `Сервер вернул 500, повторяем попытку ${retryCount + 1}/${maxRetries}`,
                )

                await new Promise((resolve) => setTimeout(resolve, 1000))
                return addComment({ name, text, forceError }, retryCount + 1)
            }
            throw new Error('Сервер сломался, попробуй позже')
        }

        if (response.status === 400) {
            throw new Error(
                'Имя и комментарий должны быть не короче 3 символов',
            )
        }

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        if (error.message === 'Failed to fetch' && retryCount < maxRetries) {
            console.log(
                `Сетевая ошибка, повторяем попытку ${retryCount + 1}/${maxRetries}`,
            )
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return addComment({ name, text, forceError }, retryCount + 1)
        }

        console.error('Ошибка при добавлении комментария:', error)
        throw error
    }
}

export const login = (login, password) => {
    return fetch(authHost + '/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.error || 'Ошибка авторизации')
            })
        }
        return response.json()
    })
}

export const registration = (name, login, password) => {
    return fetch(authHost, {
        method: 'POST',
        body: JSON.stringify({ name, login, password }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.error || 'Ошибка регистрации')
            })
        }
        return response.json()
    })
}
