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

1. **Урок 1. Зачем нужен Redux и как он устроен**
2. Урок 2. Установка и настройка Redux Toolkit
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

---

## Урок 1. Зачем нужен Redux и как он устроен

**Цель урока:** понять, какую проблему решает Redux, и разобраться с базовыми понятиями: store, action, reducer, dispatch.

### Теория

Когда приложение растёт, состояние (state) нужно расшаривать между компонентами, далёкими друг от друга в дереве. На чистом React это решается либо «prop drilling» (прокидыванием пропсов через много промежуточных компонентов), либо Context API. Оба подхода работают, но:

- prop drilling быстро превращается в кашу при глубокой вложенности;
- Context неудобен при частых обновлениях — он перерисовывает всех потребителей контекста сразу.

Redux предлагает другой подход: **всё важное состояние приложения хранится в одном объекте — store**, а изменять его можно только по строгим правилам.

Три кита Redux:

1. **Store** — единственный источник правды (single source of truth). Всё состояние приложения лежит в одном объекте.
2. **Action** — обычный JS-объект с полем `type`, описывающий, *что произошло* (например, `{ type: 'cart/itemAdded', payload: { id: 1 } }`). Action не содержит логику — только данные о событии.
3. **Reducer** — чистая функция `(state, action) => newState`. Получает текущее состояние и action, возвращает новое состояние. Reducer никогда не мутирует state напрямую и не делает побочных эффектов (запросы, таймеры и т.д.).

Поток данных всегда односторонний:

```
UI-компонент 
→ dispatch(action) 
→ reducer вычисляет новый state 
→ store обновляется 
→ подписанные компоненты перерисовываются
```

Это называется **unidirectional data flow** — данные текут в одну сторону, что делает поведение приложения предсказуемым: для любого состояния всегда можно сказать, какая последовательность actions к нему привела.

**Важно:** в этом курсе мы сразу используем **Redux Toolkit (RTK)** — официальный современный способ писать Redux-логику. «Классический» Redux (ручные `switch`, константы типов экшенов, immutable-апдейты вручную) сегодня в новых проектах не используется — RTK берёт всю эту рутину на себя.

### Когда нужен Redux, а когда — нет

- **Local state (`useState`)** — состояние, нужное только одному компоненту (открыт ли dropdown, значение поля ввода).
- **Context API** — состояние, которое редко меняется и нужно многим компонентам (тема оформления, текущий язык).
- **Redux** — состояние, расшаренное между многими несвязанными частями приложения, часто меняющееся, требующее сложной логики обновления или удобной отладки через DevTools (история действий, time-travel).

### Пример (концептуальный, без React)

Чтобы увидеть идею в чистом виде — мини-пример на базовом Redux API (без Toolkit), просто чтобы «пощупать» концепцию:

```ts
import { createStore } from 'redux'

type CounterState = { value: number }
type CounterAction = { type: 'increment' } | { type: 'decrement' }

function counterReducer(
  state: CounterState = { value: 0 },
  action: CounterAction,
): CounterState {
  switch (action.type) {
    case 'increment':
      return { value: state.value + 1 }
    case 'decrement':
      return { value: state.value - 1 }
    default:
      return state
  }
}

const store = createStore(counterReducer)

store.subscribe(() => console.log(store.getState()))

store.dispatch({ type: 'increment' }) // { value: 1 }
store.dispatch({ type: 'increment' }) // { value: 2 }
store.dispatch({ type: 'decrement' }) // { value: 1 }
```

Обратите внимание на ручную работу: `switch`, immutable-апдейт (`{ value: state.value + 1 }`, а не `state.value++`), типы actions вручную. Начиная со следующего урока мы заменим всё это на Redux Toolkit, где тот же счётчик пишется в разы короче.

### Практическое задание

Без кода — на бумаге или в заметках:

1. Опишите для интернет-магазина (корзина товаров), какие actions понадобятся (например, `cart/itemAdded`, `cart/itemRemoved`, `cart/cleared`). Для каждого — какие данные должны лежать в `payload`.
2. Опишите путь данных: что происходит от клика по кнопке «Добавить в корзину» до обновления счётчика товаров в шапке сайта.
3. Подумайте: какая часть состояния вашего текущего/будущего проекта точно должна жить в Redux, а какая — остаться в `useState`?

---

## Пример практического задания

### 1. Actions и Payload (Корзина товаров)

В чистом Redux для каждого экшена мы описываем его тип и структуру полезной нагрузки (`payload`). Вот как это выглядит в коде:

```typescript
// Описываем типы данных
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  totalAmount: number
}

// Описываем Actions и их payload
type AddItemAction = {
  type: 'cart/itemAdded'
  payload: Omit<CartItem, 'quantity'> // Передаем данные товара, 
                                      // количество изначально 1
}

type RemoveItemAction = {
  type: 'cart/itemRemoved'
  payload: string // Передаем только id товара, который нужно удалить
}

type ChangeQuantityAction = {
  type: 'cart/quantityChanged'
  payload: { id: string; quantity: number } // id товара и 
                                            // его новое количество
}

type ClearCartAction = {
  type: 'cart/cleared'
  // payload не нужен, так как мы просто очищаем всё состояние
}

type CartAction = AddItemAction 
  | RemoveItemAction 
  | ChangeQuantityAction 
  | ClearCartAction
```

### 2. Путь данных (Data Flow) в коде

Давай создадим `cartReducer` и сымитируем тот самый путь от клика по кнопке до обновления счетчика.

Помни про **главное правило: никаких `state.items.push()`**, только создание новых объектов и массивов (immutability).

```typescript
import { createStore } from 'redux'

const initialState: CartState = {
  items: [],
  totalAmount: 0
}

function cartReducer(
  state: CartState = initialState, 
  action: CartAction
): CartState {
  switch (action.type) {
    case 'cart/itemAdded': {
      const existingItem = 
        state.items.find(item => item.id === action.payload.id)
      
      let newItems: CartItem[]
      
      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        newItems = state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        // Если товара нет, добавляем его со стартовым quantity: 1
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      
      return {
        items: newItems,
        totalAmount: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        )
      }
    }

    case 'cart/itemRemoved': {
      const newItems = state.items.filter(
        item => item.id !== action.payload
      )
      return {
        items: newItems,
        totalAmount: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        )
      }
    }

    case 'cart/cleared':
      return initialState

    default:
      return state
  }
}

// Создаем стор
const store = createStore(cartReducer)

// Подписываемся на изменения (в React это 
// за нас будет делать селектор useSelector)
// Шапка сайта «слушает» стор и пересчитывает общий счетчик
store.subscribe(() => {
  const state = store.getState()
  const totalItemsCount = state.items.reduce(
    (count, item) => count + item.quantity, 0
  )
  
  console.log(`
    [Шапка сайта] Обновление! Всего товаров в корзине: ${totalItemsCount}
  `)
  console.log(`[Стор изнутри]:`, state)
})

// --- Имитация пути данных ---

// 1. Пользователь зашел на сайт. В шапке: 0 товаров.
// 2. Клик по кнопке «Добавить в корзину» условного смартфона:
store.dispatch({
  type: 'cart/itemAdded',
  payload: { id: 'prod-1', name: 'Смартфон', price: 500 }
}) 
// Вывод: [Шапка сайта] Обновление! Всего товаров в корзине: 1

// 3. Кликнули на тот же смартфон еще раз:
store.dispatch({
  type: 'cart/itemAdded',
  payload: { id: 'prod-1', name: 'Смартфон', price: 500 }
})
// Вывод: [Шапка сайта] Обновление! Всего товаров в корзине: 2

// 4. Очищаем корзину:
store.dispatch({ type: 'cart/cleared' })
// Вывод: [Шапка сайта] Обновление! Всего товаров в корзине: 0
```

### 3. Redux против useState: Что и куда?

Архитектурный вопрос из задания очень важен, чтобы не превратить Redux в свалку.

#### В Redux (Глобальное состояние)

Сюда идет то, что нужно **многим независимым компонентам** на разных уровнях вложенности, или то, что должно **сохраняться** при переходах между страницами:

* **Данные корзины** (нужны в шапке, на странице самой корзины, в карточке товара, чтобы показать "Уже в корзине").
* **Статус авторизации и данные юзера** (нужны везде: для роутинга, аватара в шапке, оформления заказа).
* **Тема оформления** (dark/light), если она влияет на всё приложение глобально.

#### В useState / useReducer (Локальное состояние)

То, что нужно **только одному компоненту** или его прямым детям прямо сейчас. Если компонент размонтируется — эти данные можно спокойно стереть:

* **Состояние ввода в input** (текст сообщения, поля ввода в форме до нажатия кнопки "Отправить").
* **Открыта/закрыта модалка** или выпадающий список (dropdown).
* **Текущая выбранная вкладка** (Tab 1, Tab 2) внутри конкретного блока.
* **Локальный статус загрузки (isLoading)** для мелкого компонента, если эти данные больше никому не нужны.
