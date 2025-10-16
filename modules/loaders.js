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
    
    form.style.display = 'none';
    formLoading.style.display = 'block';
}

export function hideFormLoading() {
    const form = document.querySelector('.add-form');
    const formLoading = document.getElementById('form-loading');
    
    form.style.display = 'block';
    formLoading.style.display = 'none';
}