export function showGlobalLoading() {
    const commentsLoading = document.getElementById('comments-loading');
    const commentsList = document.querySelector('.comments');
    
    commentsLoading.style.display = 'block';
    commentsList.style.opacity = '0.3';
}

export function hideGlobalLoading() {
    const commentsLoading = document.getElementById('comments-loading');
    const commentsList = document.querySelector('.comments');
    
    commentsLoading.style.display = 'none';
    commentsList.style.opacity = '1';
}

export function showFormLoading() {
    const form = document.querySelector('.add-form');
    const formLoading = document.getElementById('form-loading');
    
    form.style.display = 'none';  // Скрываем форму
    formLoading.style.display = 'block';  // Показываем лоадер
}

export function hideFormLoading() {
    const form = document.querySelector('.add-form');
    const formLoading = document.getElementById('form-loading');
    
    // используем flex вместо block
    form.style.display = 'flex';  // Форма изначально flex
    formLoading.style.display = 'none';  // Скрываем лоадер
}