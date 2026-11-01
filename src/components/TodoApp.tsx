import { useMemo, useState } from 'react'
import { emptyMessage, remainingLabel } from '../format.ts'
import { useTodos } from '../hooks/useTodos.ts'
import { matchesFilter } from '../todos.ts'
import type { Filter } from '../types.ts'
import { TodoFilters } from './TodoFilters.tsx'
import { TodoForm } from './TodoForm.tsx'
import { TodoList } from './TodoList.tsx'
import { TodoModal } from './TodoModal.tsx'

export function TodoApp() {
  const { todos, addTodo, toggleTodo, completeTodo, activateTodo, deleteTodo, reorderVisible } =
    useTodos()
  const [filter, setFilter] = useState<Filter>('all')
  const [openedId, setOpenedId] = useState<string | null>(null)

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos],
  )

  const visible = useMemo(
    () => todos.filter((todo) => matchesFilter(todo, filter)),
    [todos, filter],
  )

  const openedTodo = todos.find((todo) => todo.id === openedId) ?? null

  function handleAdd(title: string, description: string) {
    const created = addTodo(title, description)
    if (created && filter === 'completed') setFilter('active')
    return created
  }

  return (
    <main className="app">
      <header className="header">
        <h1 className="eyebrow">ZalogHub</h1>
      </header>

      <section className="panel" aria-label="Список задач">
        <TodoForm onAdd={handleAdd} />
        <TodoFilters filter={filter} counts={counts} onChange={setFilter} />

        {visible.length > 0 ? (
          <TodoList
            todos={visible}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onOpen={setOpenedId}
            onReorder={reorderVisible}
          />
        ) : (
          <div className="empty">
            <span className="empty-mark" aria-hidden="true" />
            <p>{emptyMessage(filter)}</p>
          </div>
        )}

        {todos.length > 0 ? (
          <div className="meta">
            <p>{remainingLabel(counts.active)}</p>
            {visible.length > 1 ? (
              <p className="hint">Тяните за точки слева, чтобы поменять порядок.</p>
            ) : null}
          </div>
        ) : null}
      </section>

      {openedTodo ? (
        <TodoModal
          todo={openedTodo}
          onClose={() => setOpenedId(null)}
          onComplete={completeTodo}
          onActivate={activateTodo}
        />
      ) : null}
    </main>
  )
}
