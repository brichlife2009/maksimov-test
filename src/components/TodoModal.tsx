import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Todo } from '../types.ts'

type TodoModalProps = {
  todo: Todo
  onClose: () => void
  onComplete: (id: string) => void
  onActivate: (id: string) => void
}

export function TodoModal({ todo, onClose, onComplete, onActivate }: TodoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previousFocus = document.activeElement
    dialogRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'),
      ]
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])

  return createPortal(
    <div className="modal-backdrop" onClick={() => onCloseRef.current()}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        aria-describedby={todo.description ? 'task-dialog-description' : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="task-dialog-title">{todo.title}</h2>
        {todo.description ? (
          <p id="task-dialog-description" className="modal-description">
            {todo.description}
          </p>
        ) : null}
        <div className="modal-actions">
          <button type="button" className="modal-close" onClick={() => onCloseRef.current()}>
            Закрыть
          </button>
          <button
            type="button"
            className="modal-complete"
            onClick={() => (todo.completed ? onActivate(todo.id) : onComplete(todo.id))}
          >
            {todo.completed ? 'Активировать' : 'Завершить'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
