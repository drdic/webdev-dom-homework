// import { comments } from './modules/data.js';
// import { getComments } from './modules/api.js';
// import { renderComments } from './modules/render.js';
// import { initAddCommentListener } from './modules/listeners.js'; // импорт изменен
// import { showGlobalLoading, hideGlobalLoading } from './modules/loaders.js';

// const commentsList = document.querySelector('.comments');
// const commentsLoading = document.getElementById('comments-loading');

// // Функции для управления загрузкой комментариев
// function showCommentsLoading() {
//     commentsLoading.style.display = 'block';
//     commentsList.style.opacity = '0.3'; // Затемняем вместо скрытия
// }

// function hideCommentsLoading() {
//     commentsLoading.style.display = 'none';
//     commentsList.style.opacity = '1'; // Возвращаем нормальную прозрачность
// }

// async function loadComments() {
//     try {
//         // ПОКАЗЫВАЕМ загрузку только при СТАРТЕ приложения
//         showCommentsLoading();
        
//         comments.length = 0;
//         const freshComments = await getComments();
//         comments.push(...freshComments);
//         renderComments(); // без аргументов!
        
//     } catch (error) {
//         commentsList.innerHTML = '<div class="error">Не удалось загрузить комментарии</div>';
//     } finally {
//         // ВСЕГДА скрываем загрузку
//         hideCommentsLoading();
//     }
// }

// loadComments();
// initAddCommentListener(); // вызов изменен и без аргументов

// export { loadComments };
// export { showFormLoading, hideFormLoading };

import { comments } from './modules/data.js';
import { getComments } from './modules/api.js';
import { renderComments } from './modules/render.js';
import { initAddCommentListener } from './modules/listeners.js';
import { showGlobalLoading, hideGlobalLoading } from './modules/loaders.js';

async function loadComments() {
    try {
        showGlobalLoading();
        
        const freshComments = await getComments();
        comments.length = 0;
        comments.push(...freshComments);
        renderComments();
        
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        const commentsList = document.querySelector('.comments');
        commentsList.innerHTML = '<div class="error">Не удалось загрузить комментарии</div>';
    } finally {
        hideGlobalLoading();
    }
}

// Запуск приложения
loadComments();
initAddCommentListener();

export { loadComments };