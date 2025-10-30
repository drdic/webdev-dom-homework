import { comments } from './data.js'
import { initLikeListeners, initQuoteListeners } from './listeners.js'

export function renderComments() {
    const container = document.querySelector('.container')

    const commentsHtml = comments
        .map(
            (comment) => `
    <li class="comment" data-id="${comment.id}">
      <div class="comment-header">
        <div>${comment.author.name}</div>
        <div>${new Date(comment.date).toLocaleString()}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">${comment.text.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
        </div>
      </div>
    </li>
  `,
        )
        .join('')

    const addCommentsHtml = `
            <div id="comments-loading" class="loading">
                Пожалуйста подождите, загружаю комментарии...
            </div>
            <div id="form-loading" class="loading" style="display: none">
                Комментарий добавляется...
            </div>
            <div class="add-form">
                <input
                    type="text"
                    class="add-form-name"
                    placeholder="Введите ваше имя"
                />
                <textarea
                    type="textarea"
                    class="add-form-text"
                    placeholder="Введите ваш коментарий"
                    rows="4"
                ></textarea>
                <div class="add-form-row">
                    <button class="add-form-button">Написать</button>
                </div>
            </div>`

    const baseHtml = `
      <ul class="comments">${commentsHtml}</ul>
      ${addCommentsHtml} 
    `

    container.innerHTML = baseHtml
    // вызываем функции из listeners.js вместо кода здесь
    initLikeListeners()
    initQuoteListeners()
}
