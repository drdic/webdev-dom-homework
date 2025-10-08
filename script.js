"use strict";

const API_BASE_URL = "https://wedev-api.sky.pro/api/v1";
const PERSONAL_KEY = "eduard-zakharevskiy";
const API_URL = `${API_BASE_URL}/${PERSONAL_KEY}/comments`;

let comments = [];

// Получаем ссылки на DOM-элементы для работы с ними
const commentsList = document.querySelector('.comments');
const nameInput = document.querySelector('.add-form-name');
const textInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');
let replyingTo = null;

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function loadComments() {
    commentsList.innerHTML = '<div class="loading">Загрузка комментариев...</div>';

    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки комментариев');
            }
            return response.json();
        })
        .then(data => {
            comments = data.comments;
            renderComments();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            commentsList.innerHTML = '<div class="error">Не удалось загрузить комментарии</div>';
        });
}

function renderComments() {
    // Генерируем HTML для каждого комментария и объединяем в одну строку
    commentsList.innerHTML = comments.map(comment => `
    <li class="comment" data-id="${comment.id}">
      <div class="comment-header">
        <div>${comment.author.name}</div>
        <div>${new Date(comment.date).toLocaleString()}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text.replace(/\n/g, '<br>')}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
        </div>
      </div>
    </li>
  `).join('');

    // Добавляем обработчики кликов на кнопки лайков
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', handleLike);
    });
    // Добавляем обработчики кликов на комментарии для ответов
    document.querySelectorAll('.comment').forEach(comment => {
        comment.addEventListener('click', function (event) {
            if (event.target.closest('.like-button')) {
                return;
            }

            const commentId = parseInt(this.dataset.id);
            const comment = comments.find(c => c.id === commentId);

            textInput.value = `> ${comment.author}: ${escapeHtml(comment.text)}\n\n`;
            replyingTo = commentId;
            textInput.focus();
        });
    });

}
// Получаем ID комментария из ближайшего родительского элемента
function handleLike(event) {
    const commentId = parseInt(event.target.closest('.comment').dataset.id);
    const comment = comments.find(c => c.id === commentId); // Находим комментарий в массиве

    comment.isLiked = !comment.isLiked; // Меняем статус лайка на противоположный
    comment.likes += comment.isLiked ? 1 : -1;  // Увеличиваем или уменьшаем счетчик лайков

    event.stopPropagation(); // Останавливаем всплытие события, чтобы не сработал обработчик комментария

    renderComments(); // Перерисовываем комментарии
}


// addButton.addEventListener('click', () => {
//     const safeName = escapeHtml(nameInput.value.trim());
//     const safeText = escapeHtml(textInput.value.trim());

//     if (safeName === '' || safeText === '') {
//         if (safeName === '') nameInput.classList.add('error');
//         if (safeText === '') textInput.classList.add('error');
//         return;
//     }


//     const now = new Date();
//     const day = now.getDate().toString().padStart(2, '0');
//     const month = (now.getMonth() + 1).toString().padStart(2, '0');
//     const year = now.getFullYear().toString().slice(-2);
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;


//     comments.push({
//         id: Date.now(),
//         author: safeName,
//         date: formattedDate,
//         text: safeText,
//         likes: 0,
//         isLiked: false
//     });

//     renderComments();

//     nameInput.value = '';
//     textInput.value = '';
//     nameInput.classList.remove('error');
//     textInput.classList.remove('error');

//     replyingTo = null;
// });

addButton.addEventListener('click', () => {
    const safeName = escapeHtml(nameInput.value.trim());
    const safeText = escapeHtml(textInput.value.trim());

    if (safeName === '' || safeText === '') {
        if (safeName === '') nameInput.classList.add('error');
        if (safeText === '') textInput.classList.add('error');
        return;
    }

    addButton.disabled = true;
    addButton.textContent = 'Добавляем...';

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: safeName,
            text: safeText
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Ошибка сервера');
                });
            }
            return response.json();
        })
        .then(data => {
            nameInput.value = '';
            textInput.value = '';
            nameInput.classList.remove('error');
            textInput.classList.remove('error');

            return loadComments();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert(error.message);
        })
        .finally(() => {
            addButton.disabled = false;
            addButton.textContent = 'Написать';
            replyingTo = null;
        });
});

nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
        nameInput.classList.remove('error');
    }
});

textInput.addEventListener('input', () => {
    if (textInput.value.trim() !== '') {
        textInput.classList.remove('error');
    }
});

renderComments();

console.log("It works!");
