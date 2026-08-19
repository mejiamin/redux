import styles from './todoList.module.css'

export function TodoList() {
  

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Что нужно сделать?"
        />
        <button className={styles.addButton}>
          Добавить
        </button>
      </div>

      <ul className={styles.list}>

        {/* todos.map */}
        <li className={styles.item}>
          <label className={styles.label}>
            <input
              type="checkbox"
            />
            <span className={styles.completed}>
              text
            </span>
          </label>
          <button
            className={styles.removeButton}
            aria-label="Удалить задачу"
          >
            ✕
          </button>
        </li>

      </ul>

      <p className={styles.empty}>Задач пока нет</p>
    </div>
  )
}
