import { getToken } from './auth.js'

// Возвращаю оригинальные настройки адресов
const API_BASE_URL = 'https://wedev-api.sky.pro/api/v2'
const PERSONAL_KEY = 'eduard-zakharevskiy' // Ваш личный ключ
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`
const AUTH_URL = 'https://wedev-api.sky.pro/api/user/login'

export async function getComments() {
    const response = await fetch(API_URL, {
        method: "GET",
    });

    if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
    }

    if (!response.ok) {
        throw new Error("Не удалось загрузить комментарии");
    }

    const responseData = await response.json();
    return responseData.comments;
}

export async function login(loginValue, password) {
    const response = await fetch(AUTH_URL, {
        method: "POST",
        body: JSON.stringify({
            login: loginValue,
            password: password,
        }),
    });

    if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
    }

    if (!response.ok) {
        throw new Error("Ошибка сервера при авторизации");
    }

    return await response.json();
}

export async function addComment({ text, forceError = false }, retryCount = 0) {
    const maxRetries = 2;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ text, forceError }),
        });

        if (response.status === 500) {
            if (retryCount < maxRetries) {
                console.log(`Сервер вернул 500, повторяем попытку ${retryCount + 1}/${maxRetries}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return addComment({ text, forceError }, retryCount + 1);
            }
            throw new Error('Сервер сломался, попробуй позже');
        }

        if (response.status === 400) {
            throw new Error('Комментарий должен быть не короче 3 символов');
        }

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch' && retryCount < maxRetries) {
            console.log(`Сетевая ошибка, повторяем попытку ${retryCount + 1}/${maxRetries}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return addComment({ text, forceError }, retryCount + 1);
        }

        console.error('Ошибка при добавлении комментария:', error);
        throw error;
    }
}