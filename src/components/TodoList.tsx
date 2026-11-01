import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableTodoItem, TodoOverlay } from './TodoItem.tsx'
import type { Todo } from '../types.ts'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
  onReorder: (nextVisibleIds: string[]) => void
}

function todoTitle(todos: Todo[], id: string | number) {
  return todos.find((todo) => todo.id === String(id))?.title ?? 'задача'
}

export function TodoList({ todos, onToggle, onDelete, onOpen, onReorder }: TodoListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeTodo = todos.find((todo) => todo.id === activeId) ?? null
  const title = (id: string | number) => `«${todoTitle(todos, id)}»`

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)

    const { active, over } = event
    if (!over || active.id === over.id) return

    const ids = todos.map((todo) => todo.id)
    const oldIndex = ids.indexOf(String(active.id))
    const newIndex = ids.indexOf(String(over.id))
    if (oldIndex < 0 || newIndex < 0) return

    onReorder(arrayMove(ids, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: {
          onDragStart({ active }) {
            return `Задача ${title(active.id)} взята.`
          },
          onDragOver({ active, over }) {
            if (!over) return `Задача ${title(active.id)} вне списка.`
            return `Задача ${title(active.id)} перемещается на место задачи ${title(over.id)}.`
          },
          onDragEnd({ active, over }) {
            if (!over) return `Перемещение задачи ${title(active.id)} отменено.`
            return `Задача ${title(active.id)} поставлена на место задачи ${title(over.id)}.`
          },
          onDragCancel({ active }) {
            return `Перемещение задачи ${title(active.id)} отменено.`
          },
        },
        screenReaderInstructions: {
          draggable:
            'Чтобы взять задачу, нажмите пробел на маркере. Стрелками меняйте позицию, пробелом отпустите, Escape отменяет.',
        },
      }}
    >
      <ul className="list">
        <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          ))}
        </SortableContext>
      </ul>
      <DragOverlay>
        {activeTodo ? <TodoOverlay todo={activeTodo} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
