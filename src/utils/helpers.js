/**
 * 生成短 UUID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

/**
 * 格式化日期为友好显示
 */
export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${min}`
}

/**
 * 优先级配置
 */
export const PRIORITY_CONFIG = {
  high: { label: '高', color: 'bg-red-400 dark:bg-red-600', textColor: 'text-white', dot: 'bg-red-500' },
  medium: { label: '中', color: 'bg-yellow-400 dark:bg-yellow-500', textColor: 'text-black', dot: 'bg-yellow-500' },
  low: { label: '低', color: 'bg-green-400 dark:bg-green-600', textColor: 'text-white', dot: 'bg-green-500' },
}

/**
 * 状态配置
 */
export const STATUS_CONFIG = {
  todo: { label: '待办', color: 'border-l-blue-400' },
  'in-progress': { label: '进行中', color: 'border-l-amber-400' },
  done: { label: '完成', color: 'border-l-green-400' },
}

export const STATUS_LIST = [
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '完成' },
]