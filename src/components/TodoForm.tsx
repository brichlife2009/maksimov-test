import { useState } from 'react'
import type { FormEvent } from 'react'

type TodoFormProps = {
  onAdd: (title: string, description: string) => boolean
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const showDescription = value.length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!value.trim()) {
      setError('Нельзя добавить пустую задачу')
      return
    }

    if (onAdd(value, description)) {
      setValue('')
      setDescription('')
      setError('')
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="composer-title">
        <label className="visually-hidden" htmlFor="todo-title">
          Заголовок задачи
        </label>
        <input
          id="todo-title"
          name="title"
          value={value}
          placeholder="Введите заголовок, чтобы начать"
          autoComplete="off"
          enterKeyHint="done"
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'todo-error' : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
        />
        <button type="submit" className="submit">
          Добавить
        </button>
      </div>
      {showDescription ? (
        <>
          <label className="visually-hidden" htmlFor="todo-description">
            Описание
          </label>
          <textarea
            id="todo-description"
            name="description"
            value={description}
            placeholder="Описание"
            rows={3}
            onChange={(event) => setDescription(event.target.value)}
          />
        </>
      ) : null}
      {error ? (
        <p id="todo-error" className="error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
