import { getComments, addComment } from './modules/api.js'
import { renderLoginPage } from './modules/login.js' 
import { isLoggedIn, getUserName, removeToken } from './modules/auth.js' 

let comments = []

export function renderApp() {
    const app = document.querySelector('.container')

    app.innerHTML = `
    <div class="loading">Загрузка комментариев...</div>
    <ul class="comments" id="comments-list"></ul>
    <div class="add-form-container"></div>
  `

    loadAndRenderComments()
    renderAddForm()
}

async function loadAndRenderComments() {
    const loadingElement = document.querySelector('.loading')
    const commentsList = document.querySelector('#comments-list')

    try {
        console.log('Начинаем загрузку комментариев...')
        loadingElement.style.display = 'block'
        commentsList.innerHTML = ''

        comments = await getComments()
        console.log('Комментарии загружены:', comments)

        if (comments.length === 0) {
            commentsList.innerHTML =
                '<li class="no-comments">Комментариев пока нет</li>'
            return
        }

        const commentsHTML = comments
            .map(
                (comment) => `
            <li class="comment">
                <div class="comment-header">
                    <div class="comment-name">${comment.author.name}</div>
                    <div class="comment-date">${new Date(comment.date).toLocaleString()}</div>
                </div>
                <div class="comment-text">${comment.text}</div>
            </li>
        `
            )
            .join('')

        commentsList.innerHTML = commentsHTML
    } catch (error) {
        console.error('Ошибка загрузки:', error)
        commentsList.innerHTML = `<li class="error">Ошибка загрузки: ${error.message}</li>`
    } finally {
        loadingElement.style.display = 'none'
        console.log('Загрузка завершена')
    }
}

function renderAddForm() {
    const container = document.querySelector('.add-form-container')

    if (isLoggedIn()) {
        container.innerHTML = `
            <div class="add-form">
                <input type="text" class="add-form-name" value="${getUserName() || ''}" readonly />
                <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
                <div class="add-form-row">
                    <button class="add-form-button">Написать</button>
                </div>
                <div class="auth-info" style="margin-top: 10px; font-size: 14px; color: #bcec30;">Вы вошли как: ${getUserName()}</div>
                <button class="logout-button" style="margin-top: 10px; background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b; padding: 5px 10px; border-radius: 6px; cursor: pointer;">Выйти</button>
            </div>
        `

        initAddFormListeners()
    } else {
        container.innerHTML = `
            <div class="auth-prompt" style="margin-top: 30px; text-align: center;">
                <p class="auth-text">Чтобы добавить комментарий, <a href="#" class="auth-link" style="color: #bcec30; text-decoration: underline;">авторизуйтесь</a></p>
            </div>
        `
        initAuthLinkListener()
    }
}

function initAuthLinkListener() {
    const authLink = document.querySelector('.auth-link')
    if (authLink) {
        authLink.addEventListener('click', (event) => {
            event.preventDefault()
            renderLoginPage()
        })
    }
}

function initAddFormListeners() {
    const addButton = document.querySelector('.add-form-button')
    const textInput = document.querySelector('.add-form-text')

    if (addButton && textInput) {
        addButton.addEventListener('click', async () => {
            const text = textInput.value.trim()

            if (!text) {
                alert('Введите текст комментария')
                return
            }

            if (text.length < 3) {
                alert('Комментарий должен быть не короче 3 символов')
                return
            }

            addButton.disabled = true
            addButton.textContent = 'Добавляем...'

            try {
                await addComment({ text })
                textInput.value = ''
                await loadAndRenderComments()
            } catch (error) {
                alert(error.message)
            } finally {
                addButton.disabled = false
                addButton.textContent = 'Написать'
            }
        })
    }

    const logoutButton = document.querySelector('.logout-button')
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            removeToken()
            renderApp()
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderApp()
})