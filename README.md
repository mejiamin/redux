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

## Пример практического задания

Покажу решение практического задания к уроку 3 — реализуем `themeSlice` с нуля.

### 1. Slice `theme`

```ts
// src/features/theme/themeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
}

const initialState: ThemeState = {
  mode: 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeToggled(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    },
    themeSet(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload
    },
  },
})

export const { themeToggled, themeSet } = themeSlice.actions
export default themeSlice.reducer
```

Разберём детали:

- `themeToggled` не принимает `payload` — ему не нужны входные данные, вся логика («переключить на противоположное») выводится из текущего `state`.
- `themeSet` принимает `PayloadAction<ThemeMode>` — то есть при вызове `themeSet('dark')` в `action.payload` попадёт именно `'dark'`, и TypeScript не даст передать туда, скажем, `'blue'`, потому что тип `ThemeMode` — это union из двух строк.
- Экспортируем `ThemeMode` отдельно — он ещё пригодится в компоненте (урок 4), когда будем типизировать пропсы/условную стилизацию.

### 2. Регистрация в store

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Если у вас уже есть `counter` из урока 3 (основной пример) — просто добавьте `theme` рядом:

```ts
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
  },
})
```

### 3. Проверка в Redux DevTools

Поскольку UI мы ещё не подключали, «руками» подиспатчить action можно прямо из панели DevTools:

1. Откройте вкладку **Redux** в DevTools браузера.
2. В разделе **State** должно быть дерево:
   ```json
   {
     "theme": { "mode": "light" }
   }
   ```
3. Во вкладке **Dispatcher** (или похожей — зависит от версии расширения) можно вручную отправить action, например:
   ```json
   { "type": "theme/themeToggled" }
   ```
   После этого в **Diff**/**State** увидите, что `mode` стал `"dark"`.
4. Попробуйте так же `{ "type": "theme/themeSet", "payload": "dark" }` — и убедитесь, что `mode` установился именно в переданное значение, а не переключился.

Обратите внимание на формат типа action — `theme/themeToggled`: `theme` здесь взялся из `name: 'theme'` в `createSlice`, а `themeToggled` — из имени reducer-функции. Это и есть то самое автоматическое именование, о котором говорилось в теории: не нужно писать константы типов вручную, RTK собирает их сам из структуры slice.

---

## Дополнительные ресурсы

- Redux Toolkit: https://redux-toolkit.js.org
- Redux core: https://redux.js.org
- React Redux: https://react-redux.js.org
