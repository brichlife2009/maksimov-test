export function remainingLabel(count: number) {
  const n = Math.abs(count)
  const mod10 = n % 10
  const mod100 = n % 100
  const one = mod10 === 1 && mod100 !== 11

  let noun = 'задач'
  if (one) noun = 'задача'
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    noun = 'задачи'
  }

  return `${one ? 'Осталась' : 'Осталось'} ${count} ${noun}`
}

export function emptyMessage(filter: 'all' | 'active' | 'completed') {
  if (filter === 'active') return 'Активных задач нет.'
  if (filter === 'completed') return 'Выполненных задач нет.'
  return 'Список пуст. Добавьте первую задачу.'
}
