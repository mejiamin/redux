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
3. **Урок 3. Первый slice: createSlice**
4. Урок 4. Подключение компонентов: useSelector и useDispatch
5. Урок 5. Несколько слайсов и архитектура приложения
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

## Урок 3. Первый slice: createSlice

**Цель урока:** научиться создавать slice — связку из reducer'а и его actions — и подключать его к store.

### Теория

В классическом Redux нужно было отдельно объявлять константы типов экшенов, action creators и reducer со `switch`. `createSlice` из RTK делает всё это одним вызовом:

```ts
createSlice({
  // префикс для типов actions, например "counter/increment"
  name: 'имя_слайса',

  // начальное состояние
  initialState: ...,

  // reducer-функции = одновременно и action creators
  reducers: {
    actionName(state, action) { ... }
  },
})
```

`createSlice` возвращает объект с готовыми `actions` (action creators, которые можно диспатчить) и `reducer` (готовая reducer-функция для store).

**Главная «магия» — Immer.** Внутри `reducers` можно писать код так, будто вы напрямую мутируете `state` (`state.value += 1`, `state.items.push(item)`) — Immer под капотом отслеживает эти «мутации» и производит из них настоящий immutable-апдейт. Реальный state в store остаётся неизменяемым, вы просто избавлены от ручных spread-операторов.

Исключение: если reducer **возвращает** новое значение явно (`return newState`), то новым state становится именно оно — мутировать `state` в этом случае уже нельзя (либо мутируем, либо возвращаем, не одновременно).

### Код: slice счётчика

```ts
// src/features/counter/counterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incremented(state) {
      state.value += 1 // выглядит как мутация, но безопасно благодаря Immer
    },
    decremented(state) {
      state.value -= 1
    },
    incrementedByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { 
  incremented, 
  decremented, 
  incrementedByAmount 
} = counterSlice.actions
export default counterSlice.reducer
```

Регистрируем reducer в store:

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Теперь `state.counter.value` доступен из любого компонента приложения.

### Практическое задание

Создайте свой slice (без подключения к UI — это будет в уроке 4):

1. Slice `theme` с состоянием `{ mode: 'light' | 'dark' }` и actions `themeToggled` (переключает mode) и `themeSet` (принимает `'light' | 'dark'` через `payload`).
2. Зарегистрируйте `theme`-reducer в `store.ts`.
3. Откройте Redux DevTools — в дереве state должна появиться ветка `theme: { mode: 'light' }`.

---

## Дополнительные ресурсы

- Redux Toolkit: https://redux-toolkit.js.org
- Redux core: https://redux.js.org
- React Redux: https://react-redux.js.org
