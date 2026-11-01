import { FILTERS } from '../types.ts'
import type { Filter } from '../types.ts'

type TodoFiltersProps = {
  filter: Filter
  counts: Record<Filter, number>
  onChange: (filter: Filter) => void
}

export function TodoFilters({ filter, counts, onChange }: TodoFiltersProps) {
  return (
    <div className="filters" role="group" aria-label="Фильтр задач">
      {FILTERS.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={filter === item.id}
          onClick={() => onChange(item.id)}
        >
          <span>{item.label}</span>
          <span className="count">{counts[item.id]}</span>
        </button>
      ))}
    </div>
  )
}
