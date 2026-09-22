import { ref, watch } from 'vue'
import { generateId } from '../utils/helpers'

const STORAGE_KEY = 'my-task-manager-tasks'

/**
 * 任务管理 composable
 * - CRUD 操作
 * - localStorage 自动持久化
 */
export function useTasks() {
  const tasks = ref(loadTasks())

  // 自动持久化
  watch(tasks, (val) => {
    saveTasks(val)
  }, { deep: true })

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function saveTasks(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  /**
   * 新增任务
   */
  function addTask({ title, description = '', priority = 'medium' }) {
    const task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tasks.value = [task, ...tasks.value]
    return task
  }

  /**
   * 更新任务
   */
  function updateTask(id, updates) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return null
    tasks.value[index] = {
      ...tasks.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    // 触发响应性
    tasks.value = [...tasks.value]
    return tasks.value[index]
  }

  /**
   * 删除任务
   */
  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  /**
   * 移动任务到新状态（拖拽用）
   */
  function moveTask(id, newStatus) {
    const task = tasks.value.find(t => t.id === id)
    if (task && task.status !== newStatus) {
      task.status = newStatus
      task.updatedAt = new Date().toISOString()
      tasks.value = [...tasks.value]
    }
  }

  /**
   * 按状态获取任务
   */
  function getTasksByStatus(status) {
    return tasks.value.filter(t => t.status === status)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  }
}