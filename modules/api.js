const API_BASE_URL = "https://wedev-api.sky.pro/api/v1";
const PERSONAL_KEY = "eduard-zakharevskiy";
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`;

// export async function getComments() {
//     const response = await fetch(API_URL);
//     if (!response.ok) throw new Error('Ошибка загрузки');
//     const data = await response.json();
//     return data.comments;
// }

// export async function addComment({ name, text }) {
//     const response = await fetch(API_URL, {
//         method: 'POST',
//         body: JSON.stringify({ name, text })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Ошибка сервера');
//     }

//     return await response.json();
// }

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

export async function addComment({ name, text, forceError = false }) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                name,
                text,
                forceError // для тестирования 500 ошибки
            })
        });

        // обработка HTTP статусов для POST запроса
        if (response.status === 500) {
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
        console.error('Ошибка при добавлении комментария:', error);
        throw error; // пробрасываем ошибку дальше
    }
}
