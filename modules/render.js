import { comments } from './data.js'
import { initLikeListeners, initQuoteListeners } from './listeners.js'

export function renderComments() {
    const commentsList = document.querySelector('#comments-list')

    if (!commentsList) return

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

    commentsList.innerHTML = commentsHtml
    initLikeListeners()
    initQuoteListeners()
}

