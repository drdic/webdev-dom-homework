import { tasks } from './tasks.js'
import { initDeleteListeners } from './initListeners.js'

export const renderTasks = () => {
    const list = document.getElementById('list')
    const tasksHtml = tasks
        .map((task, index) => {
            return `<li><span>${task.text}</span><button class="delete" data-index="${index}">удалить</button></li>`
        })
        .join('')

    list.innerHTML = tasksHtml

    initDeleteListeners()
}
