import type { Filter, Todo } from './types.ts'

const STORAGE_KEY = 'zaloghub.todos'

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false

  const todo = value as Record<string, unknown>
  return (
    typeof todo.id === 'string' &&
    todo.id.length > 0 &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean'
  )
}

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const seen = new Set<string>()

    return parsed.flatMap((item) => {
      if (!isTodo(item)) return []

      const title = item.title.trim()
      if (!title || seen.has(item.id)) return []

      const description = typeof item.description === 'string' ? item.description.trim() : ''

      seen.add(item.id)
      return [{ id: item.id, title, description, completed: item.completed }]
    })
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}

export function matchesFilter(todo: Todo, filter: Filter) {
  if (filter === 'active') return !todo.completed
  if (filter === 'completed') return todo.completed
  return true
}

export function reorderByVisibleIds(todos: Todo[], nextVisibleIds: string[]) {
  const visible = new Set(nextVisibleIds)
  const queue = [...nextVisibleIds]
  const byId = new Map(todos.map((todo) => [todo.id, todo]))

  return todos.map((todo) => {
    if (!visible.has(todo.id)) return todo

    const nextId = queue.shift()
    return (nextId && byId.get(nextId)) || todo
  })
}
