import { comments, replyingTo } from './data.js';
import { addComment } from './api.js';
import { renderComments } from './render.js';
import { escapeHtml } from './utils.js';

export function initEventListeners(commentsList, loadComments) {
    const nameInput = document.querySelector('.add-form-name');
    const textInput = document.querySelector('.add-form-text');
    const addButton = document.querySelector('.add-form-button');

    addButton.addEventListener('click', async () => {
        const safeName = escapeHtml(nameInput.value.trim());
        const safeText = escapeHtml(textInput.value.trim());

        if (!safeName || !safeText) {
            if (!safeName) nameInput.classList.add('error');
            if (!safeText) textInput.classList.add('error');
            return;
        }

        addButton.disabled = true;
        addButton.textContent = 'Добавляем...';

        try {
            await addComment({ name: safeName, text: safeText });
            nameInput.value = '';
            textInput.value = '';
            nameInput.classList.remove('error');
            textInput.classList.remove('error');
            await loadComments();
        } catch (error) {
            alert(error.message);
        } finally {
            addButton.disabled = false;
            addButton.textContent = 'Написать';
        }
    });

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim()) nameInput.classList.remove('error');
    });

    textInput.addEventListener('input', () => {
        if (textInput.value.trim()) textInput.classList.remove('error');
    });
}