import { useAppDispatch, useAppSelectore } from '@/app/hooks'
import { decremented, incremented, incrementedByAmount } from './counterSlice'
import styles from './counter.module.css'

export const Counter = () => {
  const count = useAppSelectore(state => state.counter.value)
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
