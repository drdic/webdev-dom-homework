import { comments } from './modules/data.js'
import { getComments } from './modules/api.js'
import { renderComments } from './modules/render.js'
import { initAddCommentListener } from './modules/listeners.js'
import { showGlobalLoading, hideGlobalLoading } from './modules/loaders.js'

async function loadComments() {
    try {
        showGlobalLoading()

        const freshComments = await getComments()
        comments.length = 0
        comments.push(...freshComments)
        renderComments()
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error)
        const commentsList = document.querySelector('.comments')
        commentsList.innerHTML =
            '<div class="error">Не удалось загрузить комментарии</div>'
    } finally {
        hideGlobalLoading()
    }
}

// Запуск приложения
loadComments()
initAddCommentListener()

export { loadComments }
