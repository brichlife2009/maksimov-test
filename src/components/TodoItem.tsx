import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../types.ts'

type TodoActions = {
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
}

type SortableTodoItemProps = TodoActions & {
  todo: Todo
}

function todoClassName(completed: boolean, dragging = false, overlay = false) {
  return [
    'todo',
    completed ? 'is-done' : '',
    dragging ? 'is-dragging' : '',
    overlay ? 'is-overlay' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5.5" cy="3.5" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="3.5" r="1.15" fill="currentColor" />
      <circle cx="5.5" cy="8" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="8" r="1.15" fill="currentColor" />
      <circle cx="5.5" cy="12.5" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="12.5" r="1.15" fill="currentColor" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2.2 6.2 4.8 8.8 9.8 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 3 11 11 M11 3 3 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckControl({
  todo,
  overlay,
  onToggle,
}: {
  todo: Todo
  overlay?: boolean
  onToggle?: (id: string) => void
}) {
  if (overlay) {
    return (
      <span className={todo.completed ? 'box is-checked' : 'box'} aria-hidden="true">
        {todo.completed ? <CheckIcon /> : null}
      </span>
    )
  }

  return (
    <span className="check">
      <input
        className="check-input"
        type="checkbox"
        checked={todo.completed}
        aria-label={
          todo.completed
            ? `Вернуть задачу «${todo.title}» в активные`
            : `Завершить задачу «${todo.title}»`
        }
        onChange={() => onToggle?.(todo.id)}
      />
      <span className="box" aria-hidden="true">
        {todo.completed ? <CheckIcon /> : null}
      </span>
    </span>
  )
}

export function SortableTodoItem({
  todo,
  onToggle,
  onDelete,
  onOpen,
}: SortableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id })

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={todoClassName(todo.completed, isDragging)}
    >
      <button
        type="button"
        className="handle"
        {...attributes}
        {...listeners}
        aria-label={`Переместить задачу «${todo.title}»`}
      >
        <GripIcon />
      </button>
      <CheckControl todo={todo} onToggle={onToggle} />
      <button
        type="button"
        className="title"
        onClick={() => onOpen(todo.id)}
      >
        {todo.title}
      </button>
      <button
        type="button"
        className="delete"
        aria-label={`Удалить задачу «${todo.title}»`}
        onClick={() => onDelete(todo.id)}
      >
        <CloseIcon />
      </button>
    </li>
  )
}

export function TodoOverlay({ todo }: { todo: Todo }) {
  return (
    <div className={todoClassName(todo.completed, false, true)} aria-hidden="true">
      <span className="handle">
        <GripIcon />
      </span>
      <CheckControl todo={todo} overlay />
      <span className="title">{todo.title}</span>
      <span className="delete">
        <CloseIcon />
      </span>
    </div>
  )
}
