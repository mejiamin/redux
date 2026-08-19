import { useAppDispatch, useAppSelectore } from '@/app/hooks'
import { themeToggled } from './themeSlice'
import styles from './theme.module.css'

export const Theme = () => {
  const mode = useAppSelectore(state => state.theme.mode)
  const dispatch = useAppDispatch()

  return (
    <button
      className={mode === 'dark' ? styles.dark : styles.light}
      onClick={() => dispatch(themeToggled())}
    >
      Текущая тема: {mode === 'dark' ? 'Темная' : 'Светлая'}
    </button>
  )
}
