import { comments } from './data.js'
import { addComment, getComments } from './api.js'
import { renderComments } from './render.js'
import { showFormLoading, hideFormLoading } from './loaders.js'
import { escapeHtml } from './utils.js'

export function initAddCommentListener() {
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', async () => {
        const safeName = escapeHtml(nameInput.value.trim())
        const safeText = escapeHtml(textInput.value.trim())

        // Валидация длины
        if (safeName.length < 3 || safeText.length < 3) {
            alert('Имя и комментарий должны быть не короче 3 символов')
            return
        }

        // Сохраняем данные ДО отправки
        const savedName = nameInput.value
        const savedText = textInput.value

        // Показываем лоадер
        showFormLoading()
        addButton.disabled = true
        addButton.textContent = 'Отправляем...'

        try {
            // Вызываем улучшенную функцию с автоматическими повторами
            await addComment({
                name: safeName,
                text: safeText,
                forceError: false, // Меняй на true для тестирования 500 ошибок
            })

            // Если успешно - очищаем форму
            nameInput.value = ''
            textInput.value = ''
            nameInput.classList.remove('error')
            textInput.classList.remove('error')

            // Обновляем комментарии
            const updatedComments = await getComments()
            comments.length = 0
            comments.push(...updatedComments)
            renderComments()
        } catch (error) {
            // ОБРАБОТКА ОШИБОК (после всех неудачных попыток):
            if (error.message === 'Failed to fetch') {
                alert('Кажется, у вас сломался интернет, попробуйте позже')
            } else if (error.message.includes('Сервер сломался')) {
                alert('Сервер сломался, попробуй позже')
            } else if (error.message.includes('не короче 3 символов')) {
                alert('Имя и комментарий должны быть не короче 3 символов')
            } else {
                alert(error.message)
            }

            // Восстанавливаем данные в форме
            nameInput.value = savedName
            textInput.value = savedText
        } finally {
            // Всегда возвращаем форму
            hideFormLoading()
            addButton.disabled = false
            addButton.textContent = 'Написать'
        }
    })

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim()) nameInput.classList.remove('error')
    })

    textInput.addEventListener('input', () => {
        if (textInput.value.trim()) textInput.classList.remove('error')
    })
}

export function initLikeListeners() {
    document.querySelectorAll('.like-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const commentId = parseInt(
                event.target.closest('.comment').dataset.id,
            )
            const comment = comments.find((c) => c.id === commentId)

            if (comment) {
                comment.isLiked = !comment.isLiked
                comment.likes += comment.isLiked ? 1 : -1
                renderComments()
            }
        })
    })
}

export function initQuoteListeners() {
    document.querySelectorAll('.comment').forEach((commentElement) => {
        commentElement.addEventListener('click', function (event) {
            if (event.target.closest('.like-button')) {
                return
            }

            const commentId = parseInt(this.dataset.id)
            const comment = comments.find((c) => c.id === commentId)

            if (comment) {
                const textInput = document.querySelector('.add-form-text')
                const quoteText = `> ${comment.author.name}: ${comment.text}\n\n`
                textInput.value = quoteText
                textInput.focus()
                textInput.scrollIntoView({ behavior: 'smooth' })
            }
        })
    })
}
