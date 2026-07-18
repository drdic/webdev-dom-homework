import { comments } from './data.js'
import { renderComments } from './render.js'
export function initLikeListeners() {
    document.querySelectorAll('.like-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const commentId = event.target.closest('.comment').dataset.id
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

            const commentId = this.dataset.id
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

