import { useCallback, useEffect, useState } from 'react'
import { loadTodos, reorderByVisibleIds, saveTodos } from '../todos.ts'
import type { Todo } from '../types.ts'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((title: string, description: string) => {
    const trimmed = title.trim()
    if (!trimmed) return false

    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        description: description.trim(),
        completed: false,
      },
      ...prev,
    ])

    return true
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const completeTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo)),
    )
  }, [])

  const activateTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: false } : todo)),
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const reorderVisible = useCallback((nextVisibleIds: string[]) => {
    setTodos((prev) => reorderByVisibleIds(prev, nextVisibleIds))
  }, [])

  return { todos, addTodo, toggleTodo, completeTodo, activateTodo, deleteTodo, reorderVisible }
}
