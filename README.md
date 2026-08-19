# Курс по Redux: от основ до RTK Query

Практический курс для изучения Redux Toolkit в связке с **React + Vite + TypeScript + CSS Modules**.

## Для кого этот курс

Вы уже знаете React (компоненты, хуки, props/state), но Redux видели только поверхностно — этот курс для вас. Базовые вещи React здесь не объясняются, мы сразу идём в Redux.

## Стек технологий

- **React** — UI-библиотека
- **Vite** — сборщик и dev-сервер
- **TypeScript** — типизация
- **CSS Modules** — изолированные стили компонентов
- **Redux Toolkit (RTK)** — официальный способ работы с Redux (актуальная линейка версий — 2.x)
- **React Redux** — биндинги Redux для React (хуки `useSelector`/`useDispatch`)

## Сколько уроков

**Всего уроков: 10.** Каждый урок построен по одной схеме: теория → код-пример под ваш стек → практическое задание.

## Содержание

1. Урок 1. Зачем нужен Redux и как он устроен
2. Урок 2. Установка и настройка Redux Toolkit
3. Урок 3. Первый slice: createSlice
4. Урок 4. Подключение компонентов: useSelector и useDispatch
5. **Урок 5. Несколько слайсов и архитектура приложения**
6. Урок 6. Асинхронность: createAsyncThunk
7. Урок 7. RTK Query: запросы к серверу
8. Урок 8. Селекторы и производительность: createSelector
9. Урок 9. Redux DevTools и отладка
10. Урок 10. Лучшие практики и финальный проект

## Как заниматься

- Идите по урокам по порядку — каждый следующий опирается на предыдущий.
- В своём проекте (React+Vite+TS+CSS Modules уже установлены) выполняйте практическое задание после каждого урока.
- Не переходите к асинхронности (урок 6) и RTK Query (урок 7), пока не освоились со слайсами и хуками (уроки 3–4) — это фундамент.

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

---

## Урок 5. Несколько слайсов и архитектура приложения

**Цель урока:** научиться организовывать несколько слайсов вместе и понять, когда состояние должно жить в Redux, а когда — оставаться локальным.

### Теория

В реальном приложении слайсов много — каждая фича (корзина, пользователь, фильтры, todos) обычно получает свой slice. `configureStore` принимает объект `reducer`, где ключ — это имя в дереве state, а значение — reducer соответствующего slice:

```ts
configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
    todos: todosReducer,
  },
})
```

Под капотом это делает то же самое, что `combineReducers` в классическом Redux — итоговый state выглядит как `{ counter: {...}, theme: {...}, todos: {...} }`.

**Эвристика «Redux или useState»:**

| Признак | useState | Redux |
|---|---|---|
| Нужен только одному компоненту | ✅ | |
| Нужен нескольким несвязанным компонентам | | ✅ |
| Простое значение (toggle, поле ввода) | ✅ | |
| Сложная логика обновления, важна история изменений | | ✅ |
| Должно переживать размонтирование компонента | | ✅ |
| Нужна отладка через time-travel | | ✅ |

Не нужно «тащить в Redux всё подряд» — локальный `useState` для состояния открытой модалки или значения поля поиска внутри одного компонента — это нормально и даже предпочтительно (меньше boilerplate, меньше лишних рендеров всего приложения).

### Код: slice списка задач (todos)

```ts
// src/features/todos/todosSlice.ts
import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

type TodosState = Todo[]

const initialState: TodosState = []

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: {
      reducer(state, action: PayloadAction<Todo>) {
        state.push(action.payload)
      },
      // prepare-колбэк формирует payload до того, как он попадёт в reducer
      prepare(text: string) {
        return { payload: { id: nanoid(), text, completed: false } }
      },
    },
    todoToggled(state, action: PayloadAction<string>) {
      const todo = state.find((t) => t.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
    todoRemoved(state, action: PayloadAction<string>) {
      return state.filter((t) => t.id !== action.payload)
    },
  },
})

export const { todoAdded, todoToggled, todoRemoved } = todosSlice.actions
export default todosSlice.reducer
```

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import themeReducer from '../features/theme/themeSlice'
import todosReducer from '../features/todos/todosSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
    todos: todosReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Обратите внимание на `prepare`-колбэк в `todoAdded` — он позволяет принимать «сырые» аргументы (просто `text: string`), а уже внутри генерировать `id` и собирать полноценный объект `payload`. Удобный приём, когда action creator должен принимать не то же самое, что лежит в payload.

### Практическое задание

1. Постройте компонент `TodoList`: поле ввода + кнопка «Добавить», список задач с чекбоксом (toggle) и кнопкой удаления.
2. Используйте `todoAdded`, `todoToggled`, `todoRemoved` через `useAppDispatch`.
3. Заведите CSS Modules для списка: зачёркнутый текст для выполненных задач (`text-decoration: line-through`).
4. Подумайте и запишите: какая часть UI здесь могла бы остаться на `useState` вместо Redux (например, значение поля ввода до нажатия «Добавить»)? Сделайте именно так.

---

## Пример практического задания

Покажу решение практического задания к уроку 5 — компонент `TodoList` поверх `todosSlice` из теории урока.

### 1–2. Компонент TodoList

```tsx
// src/features/todos/TodoList.tsx
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { todoAdded, todoToggled, todoRemoved } from './todosSlice'
import styles from './TodoList.module.css'

export function TodoList() {
  // локальное состояние поля ввода — см. пункт 4
  const [text, setText] = useState('')

  const todos = useAppSelector((state) => state.todos)
  const dispatch = useAppDispatch()

  function handleAdd() {
    const trimmed = text.trim()
    if (!trimmed) return // не добавляем пустые задачи

    dispatch(todoAdded(trimmed))
    setText('') // очищаем поле после добавления
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          value={text}
          placeholder="Что нужно сделать?"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className={styles.addButton} onClick={handleAdd}>
          Добавить
        </button>
      </div>

      <ul className={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.item}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch(todoToggled(todo.id))}
              />
              <span className={todo.completed ? styles.completed : undefined}>
                {todo.text}
              </span>
            </label>
            <button
              className={styles.removeButton}
              onClick={() => dispatch(todoRemoved(todo.id))}
              aria-label="Удалить задачу"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className={styles.empty}>Задач пока нет</p>}
    </div>
  )
}
```

Пара моментов, на которые стоит обратить внимание:

- `dispatch(todoAdded(trimmed))` — напомню, что в `todosSlice` у `todoAdded` есть `prepare`-колбэк (урок 5, теория), поэтому мы передаём просто строку `trimmed`, а не готовый объект `{ id, text, completed }` — `id` и `completed: false` генерируются автоматически внутри slice.
- `onKeyDown` с проверкой на `Enter` — небольшое улучшение UX, чтобы не заставлять пользователя обязательно кликать мышью по кнопке.
- Пустая проверка `if (!trimmed) return` — предохраняет store от мусорных пустых задач; такую валидацию логично держать в компоненте, а не в reducer'е (reducer не должен «отказываться» выполнять action — это должно решаться до dispatch).

### 3. Что осталось на useState

В коде выше уже сделано правильно: **значение поля ввода (`text`) живёт в локальном `useState`**, а не в Redux. Объясню почему:

- Оно нужно **только этому одному компоненту** — ни шапка сайта, ни другая часть приложения не должны знать, что пользователь сейчас печатает в поле.
- Оно **временное и одноразовое** — как только задача добавлена, значение сбрасывается и не имеет смысла как часть «истории приложения» (в отличие от `todos`, которые как раз стоит помнить и, например, видеть в time-travel Redux DevTools).
- Хранение в Redux означало бы, что **каждое нажатие клавиши** диспатчит action и проходит через store — лишняя нагрузка и мусор в Action log DevTools (представьте лог из сотен `input/charTyped` вместо осмысленных `todos/todoAdded`).

Правило по аналогии с уроком 1: если состояние не нужно за пределами компонента и не должно переживать его собственную жизнь — это кандидат на `useState`, а не на Redux. Здесь `text` — учебный пример именно такого состояния.

---

## Дополнительные ресурсы

- Redux Toolkit: https://redux-toolkit.js.org
- Redux core: https://redux.js.org
- React Redux: https://react-redux.js.org
