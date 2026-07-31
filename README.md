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
2. **Урок 2. Установка и настройка Redux Toolkit**
3. Урок 3. Первый slice: createSlice
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

## Урок 2. Установка и настройка Redux Toolkit

**Цель урока:** установить Redux Toolkit и React Redux в проект, создать store и подключить его к приложению.

### Теория

Redux Toolkit (RTK) состоит из двух пакетов:

- `@reduxjs/toolkit` — сам Redux Toolkit (включает Redux core, Immer, Redux Thunk, RTK Query «из коробки»);
- `react-redux` — биндинги для React (компонент `Provider`, хуки `useSelector`/`useDispatch`).

`configureStore` — главная функция для создания store. В отличие от старого `createStore`, она по умолчанию:

- объединяет несколько reducer'ов в один (через объект `reducer`);
- подключает Redux Thunk middleware (для асинхронной логики, см. урок 6);
- включает поддержку Redux DevTools Extension, если она установлена в браузере;
- в dev-режиме включает проверки на мутации state и несериализуемые значения в actions.

Чтобы компоненты React могли получить доступ к store, всё приложение оборачивается в `<Provider store={store}>` — это делается один раз, в точке входа.

### Установка (установлена!)

```bash
npm install @reduxjs/toolkit react-redux
```

### Структура папок

Для RTK принят **feature-based** подход — код группируется не по типу файла (все reducer'ы в одной папке, все actions в другой), а по фиче:

```
src/
  app/
    store.ts       # конфигурация store
    hooks.ts       # типизированные хуки (урок 4)
  features/
    counter/
      counterSlice.ts
      Counter.tsx
      Counter.module.css
  main.tsx
```

### Код: настройка store

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // сюда будем добавлять slice-редьюсеры в следующих уроках
    // counter: counterReducer,
  },
})

// Типы для всего приложения — пригодятся в уроке 4
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```

### Практическое задание

1. Установите `@reduxjs/toolkit` и `react-redux` в своём проекте.
2. Создайте `src/app/store.ts` с пустым `reducer: {}` и экспортируйте типы `RootState`/`AppDispatch`.
3. Оберните `<App />` в `<Provider store={store}>` в `main.tsx`.
4. Установите расширение **Redux DevTools** в браузер и убедитесь, что оно «видит» ваш store (вкладка Redux покажет пустое состояние `{}`).

---

## Дополнительные ресурсы

- Redux Toolkit: https://redux-toolkit.js.org
- Redux core: https://redux.js.org
- React Redux: https://react-redux.js.org
