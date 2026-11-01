export type Todo = {
  id: string
  title: string
  description: string
  completed: boolean
}

export type Filter = 'all' | 'active' | 'completed'

export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'Активные' },
  { id: 'completed', label: 'Выполненные' },
]
