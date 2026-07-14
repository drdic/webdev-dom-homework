const API_BASE_URL = 'https://wedev-api.sky.pro/api/v2'
const PERSONAL_KEY = 'eduard-zakharevskiy'
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`
const authHost = 'https://wedev-api.sky.pro/api/user'

import { getToken } from './auth.js'

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
    { text, forceError = false }, // Убрали name из аргументов
    retryCount = 0,
) {
    const maxRetries = 2 // максимально 2 повторные попытки [cite: 8]

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                // Динамически берем актуальный токен из auth.js перед отправкой
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ text, forceError }), // Передаем только text и forceError
        })

        // обработка HTTP статусов [cite: 8]
        if (response.status === 500) { [cite: 8]
            if (retryCount < maxRetries) { [cite: 8]
                console.log( [cite: 8]
                    `Сервер вернул 500, повторяем попытку ${retryCount + 1}/${maxRetries}`, [cite: 8]
                ) [cite: 8]

                await new Promise((resolve) => setTimeout(resolve, 1000)) [cite: 8]
                return addComment({ text, forceError }, retryCount + 1) // Убрали name [cite: 8]
            } [cite: 8]
            throw new Error('Сервер сломался, попробуй позже') [cite: 8]
        } [cite: 8]

        if (response.status === 400) { [cite: 8]
            throw new Error( [cite: 8]
                'Комментарий должен быть не короче 3 символов', // Скорректировали текст ошибки под v2
            ) [cite: 8]
        } [cite: 8]

        if (!response.ok) { [cite: 8]
            throw new Error(`Ошибка сервера: ${response.status}`) [cite: 8]
        } [cite: 8]

        return await response.json() [cite: 8]
    } catch (error) { [cite: 8]
        if (error.message === 'Failed to fetch' && retryCount < maxRetries) { [cite: 8]
            console.log( [cite: 8]
                `Сетевая ошибка, повторяем попытку ${retryCount + 1}/${maxRetries}`, [cite: 8]
            ) [cite: 8]
            await new Promise((resolve) => setTimeout(resolve, 1000)) [cite: 8]
            return addComment({ text, forceError }, retryCount + 1) // Убрали name [cite: 8]
        } [cite: 8]

        console.error('Ошибка при добавлении комментария:', error) [cite: 8]
        throw error [cite: 8]
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
