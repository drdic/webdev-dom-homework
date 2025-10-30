import { login } from './api.js'  // заменил loginUser на login
import { setToken } from './auth.js'
import { renderApp } from '../main.js'

export function renderLoginPage() {
    const app = document.querySelector('.container')

    app.innerHTML = `
    <div class="login-form">
      <h2>Вход в систему</h2>
      <form class="login-form">
        <input 
          type="text" 
          class="login-input" 
          placeholder="Логин" 
          value="admin"  // временно для теста
          required
        />
        <input 
          type="password" 
          class="password-input" 
          placeholder="Пароль" 
          value="admin"  // временно для теста
          required
        />
        <button type="submit" class="login-button">Войти</button>
      </form>
      <div class="login-error" style="display: none; color: red; margin-top: 10px;"></div>
      <button class="back-button">← Назад к комментариям</button>
    </div>
  `

    initLoginListeners()
}

function initLoginListeners() {
    const loginForm = document.querySelector('.login-form')
    const backButton = document.querySelector('.back-button')
    const errorElement = document.querySelector('.login-error')

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const loginInput = document.querySelector('.login-input')
        const passwordInput = document.querySelector('.password-input')
        const loginButton = document.querySelector('.login-button')

        const loginValue = loginInput.value.trim()  // ← ИЗМЕНИЛ: login на loginValue
        const password = passwordInput.value.trim()

        // Валидация
        if (!loginValue || !password) {
            showError('Заполните все поля')
            return
        }

        // Блокируем кнопку на время запроса
        loginButton.disabled = true
        loginButton.textContent = 'Входим...'
        hideError()

        try {
            // отправляем запрос на авторизацию
            const response = await login(loginValue, password)  // ← ИЗМЕНИЛ: новый формат вызова
            const token = response.token  // ← ИЗМЕНИЛ: получаем токен из response

            // сохраняем токен
            setToken(token)

            // возвращаем на главную страницу
            renderApp()
        } catch (error) {
            // обработка ошибок авторизации
            if (error.message.includes('Неверный логин или пароль')) {
                showError('Неверный логин или пароль')
            } else if (error.message === 'Failed to fetch') {
                showError('Проблемы с интернетом. Проверьте подключение')
            } else {
                showError('Ошибка сервера. Попробуйте позже')
            }

            // очищаем пароль при ошибке
            passwordInput.value = ''
        } finally {
            // разблокируем кнопку
            loginButton.disabled = false
            loginButton.textContent = 'Войти'
        }
    })

    backButton.addEventListener('click', () => {
        renderApp()
    })

    function showError(message) {
        errorElement.textContent = message
        errorElement.style.display = 'block'
    }

    function hideError() {
        errorElement.style.display = 'none'
    }
}