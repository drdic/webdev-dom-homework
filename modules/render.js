import { toggleLike } from './utils.js';

export function renderComments(comments, commentsList) {
    commentsList.innerHTML = comments.map(comment => `
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
  `).join('');

    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const commentId = parseInt(event.target.closest('.comment').dataset.id);
            toggleLike(comments, commentId);
            renderComments(comments, commentsList);
        });
    });
}
