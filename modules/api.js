const API_BASE_URL = "https://wedev-api.sky.pro/api/v1";
const PERSONAL_KEY = "eduard-zakharevskiy";
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`;

export async function getComments() {
    try {
        const response = await fetch(API_URL);

        // обработка статусов для GET запроса
        if (response.status === 500) {
            throw new Error("Сервер сломался, попробуй позже");
        }

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }

        const data = await response.json();
        return data.comments;

    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error);
        throw error; // прокидываем ошибку дальше

    }
}

export async function addComment({ name, text, forceError = false }, retryCount = 0) {
    const maxRetries = 2; // максимально 2 повторные попытки

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                name,
                text,
                forceError
            })
        });

        // обработка HTTP статусов
        if (response.status === 500) {
            // если есть еще попытки, повторяем
            if (retryCount < maxRetries) {
                console.log(`Сервер вернул 500, повторяем попытку ${retryCount + 1}/${maxRetries}`);
                // ждем 1 сек перед повторной попыткой
                await new Promise(resolve => setTimeout(resolve, 1000));
                return addComment({ name, text, forceError }, retryCount + 1);
            }
            throw new Error("Сервер сломался, попробуй позже");
        }

        if (response.status === 400) {
            throw new Error("Имя и комментарий должны быть не короче 3 символов");
        }

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        // если ошибка сети и есть еще попытки - повторяем
        if (error.message === 'Failed to fetch' && retryCount < maxRetries) {
            console.log(`Сетевая ошибка, повторяем попытку ${retryCount + 1}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return addComment({ name, text, forceError }, retryCount + 1);
        }

        console.error('Ошибка при добавлении комментария:', error);
        throw error;
    }
}
