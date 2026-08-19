import styles from './counter.module.css'

export const Counter = () => {
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
      >
        −
      </button>
      <span className={styles.value}>3</span>
      <button
        className={styles.button}
      >
        +
      </button>
      <button
        className={styles.button}
      >
        +5
      </button>
    </div>
  )
}
