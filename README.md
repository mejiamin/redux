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
4. **Урок 4. Подключение компонентов: useSelector и useDispatch**
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

## Урок 4. Подключение компонентов: useSelector и useDispatch

**Цель урока:** читать данные из store и отправлять actions из React-компонентов с полной типизацией.

### Теория

React Redux даёт два хука:

- **`useSelector(selectorFn)`** — подписывает компонент на часть state. Компонент перерисуется только тогда, когда результат `selectorFn` изменился (сравнение по `===`).
- **`useDispatch()`** — возвращает функцию `dispatch`, через которую отправляются actions.

**Важный нюанс `useSelector`:** не возвращайте из селектора новый объект/массив на каждый вызов (`state => ({ a: state.a, b: state.b })`) — это будет считаться «изменением» на каждом рендере и вызовет лишние перерисовки. Либо выбирайте примитив/уже существующую ссылку, либо используйте мемоизированные селекторы (урок 8).

**Типизация.** По умолчанию `useDispatch`/`useSelector` ничего не знают про ваши `RootState`/`AppDispatch`. Актуальный рекомендуемый способ — метод `.withTypes()`, добавленный в React Redux 9.1:

```ts
// src/app/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Эти типизированные хуки кладутся в отдельный файл (не в `store.ts`, чтобы избежать циклических импортов) и используются вместо обычных `useDispatch`/`useSelector` везде в приложении.

### Код: компонент счётчика

```tsx
// src/features/counter/Counter.tsx
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { incremented, decremented, incrementedByAmount } from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div className={styles.wrapper}>
      <button 
        className={styles.button} 
        onClick={() => dispatch(decremented())}
      >
        −
      </button>
      <span className={styles.value}>{count}</span>
      <button 
        className={styles.button} 
        onClick={() => dispatch(incremented())}
      >
        +
      </button>
      <button 
        className={styles.button} 
        onClick={() => dispatch(incrementedByAmount(5))}
      >
        +5
      </button>
    </div>
  )
}
```

### Практическое задание

1. Создайте `src/app/hooks.ts` с типизированными `useAppDispatch`/`useAppSelector` по примеру выше.
2. Постройте компонент `ThemeToggle` для slice `theme` из урока 3: кнопка показывает текущий `mode` и по клику диспатчит `themeToggled`.
3. Стилизуйте `ThemeToggle` через CSS Modules — пусть фон кнопки меняется в зависимости от `mode` (например, через условный класс: `className={mode === 'dark' ? styles.dark : styles.light}`).
4. Проверьте в Redux DevTools, что клики действительно диспатчат `theme/themeToggled`.

---

## Пример практического задания

Покажу решение практического задания к уроку 4 — подключаем `theme`-slice к реальному UI.

### 1. Типизированные хуки

```ts
// src/app/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Эти два хука — просто «предварительно настроенные» версии `useDispatch`/`useSelector`. Теперь TypeScript будет знать форму всего state и форму dispatch-функции без ручного указания типов в каждом компоненте.

### 2. Компонент ThemeToggle

```tsx
// src/features/theme/ThemeToggle.tsx
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { themeToggled } from './themeSlice'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const mode = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()

  return (
    <button
      className={mode === 'dark' ? styles.dark : styles.light}
      onClick={() => dispatch(themeToggled())}
    >
      Текущая тема: {mode === 'dark' ? 'Тёмная' : 'Светлая'}
    </button>
  )
}
```

Разберём, что здесь происходит:

- `useAppSelector((state) => state.theme.mode)` — читаем только нужное значение, не весь `state.theme`. Так компонент перерисуется только при изменении именно `mode`.
- `dispatch(themeToggled())` — вызываем action creator без аргументов (напомню, `themeToggled` не принимает payload), результат — объект `{ type: 'theme/themeToggled' }`, который уходит в store.
- Класс кнопки выбирается условно прямо в JSX — простой и читаемый способ для двух вариантов; если состояний станет больше трёх, обычно переходят на `classnames`/`clsx` библиотеку, но для двух значений это избыточно.

### 3. Проверка в Redux DevTools

1. Подключите `<ThemeToggle />` куда-нибудь в `App.tsx`, чтобы она реально рендерилась.
2. Откройте вкладку **Redux** в DevTools браузера.
3. Кликните по кнопке несколько раз.
4. В **Action log** должна появляться последовательность записей `theme/themeToggled` — по одной на каждый клик.
5. Кликните на любую из записей → во вкладке **Diff** увидите, как `mode` переключался между `"light"` и `"dark"` на каждом шаге.
6. Попробуйте **time-travel**: перетащите ползунок истории на несколько шагов назад — кнопка в UI должна визуально «вернуться» к прошлому состоянию (другой цвет фона, другой текст).

Если в логе вместо `theme/themeToggled` видите что-то другое (например, action вообще не появляется) — проверьте: `<Provider store={store}>` действительно оборачивает `App`, и `themeReducer` зарегистрирован в `store.ts` под ключом `theme` (иначе `state.theme` будет `undefined`, и селектор упадёт с ошибкой при обращении к `.mode`).

---

## Дополнительные ресурсы

- Redux Toolkit: https://redux-toolkit.js.org
- Redux core: https://redux.js.org
- React Redux: https://react-redux.js.org
