const API_BASE_URL = "https://wedev-api.sky.pro/api/v1";
const PERSONAL_KEY = "eduard-zakharevskiy";
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`;

export async function getComments() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Ошибка загрузки');
    const data = await response.json();
    return data.comments;
}

export async function addComment({ name, text }) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ name, text })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка сервера');
    }

    return await response.json();
}