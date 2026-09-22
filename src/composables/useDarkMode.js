import { ref, watch } from 'vue'

const STORAGE_KEY = 'my-task-manager-dark-mode'

/**
 * 深色模式 composable
 * - 切换 dark class
 * - localStorage 持久化选择
 */
export function useDarkMode() {
  const isDark = ref(loadDarkMode())

  function loadDarkMode() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      return stored === 'true'
    }
    // 默认跟随系统
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function applyDark(value) {
    if (value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleDark() {
    isDark.value = !isDark.value
  }

  // 初始应用
  applyDark(isDark.value)

  // 响应式持久化 + 应用
  watch(isDark, (val) => {
    localStorage.setItem(STORAGE_KEY, String(val))
    applyDark(val)
  })

  return {
    isDark,
    toggleDark,
  }
}