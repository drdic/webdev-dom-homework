import { comments } from './modules/data.js';
import { getComments } from './modules/api.js';
import { renderComments } from './modules/render.js';
import { initEventListeners } from './modules/listeners.js';

const commentsList = document.querySelector('.comments');

async function loadComments() {
    try {
        commentsList.innerHTML = '<div class="loading">Загрузка комментариев...</div>';
        comments.length = 0;
        comments.push(...await getComments());
        renderComments(comments, commentsList);
    } catch (error) {
        commentsList.innerHTML = '<div class="error">Не удалось загрузить комментарии</div>';
    }
}


loadComments();
initEventListeners(commentsList, loadComments);