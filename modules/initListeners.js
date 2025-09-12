import { renderTasks } from './renderTasks.js'
import { tasks } from './tasks.js'

export const initDeleteListeners = () => {
    const deleteElements = document.querySelectorAll('.delete')

    for (const deleteElement of deleteElements) {
        deleteElement.addEventListener('click', (event) => {
            event.stopPropagation()
            const index = deleteElement.dataset.index
            tasks.splice(index, 1)
            renderTasks()
        })
    }
}
