<script setup>
import { ref, computed } from 'vue'
import { Toaster, toast } from 'vue-sonner'
import Header from './components/Header.vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskForm from './components/TaskForm.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { useTasks } from './composables/useTasks'
import { useDarkMode } from './composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks()

// 表单控制
const showForm = ref(false)
const editingTask = ref(null)

// 任务统计
const stats = computed(() => ({
  todo: tasks.value.filter(t => t.status === 'todo').length,
  'in-progress': tasks.value.filter(t => t.status === 'in-progress').length,
  done: tasks.value.filter(t => t.status === 'done').length,
  total: tasks.value.length,
}))

// === 搜索 ===
// 已确认的搜索词；空字符串 = 未在搜索，显示全部
const activeQuery = ref('')
const isSearchActive = computed(() => activeQuery.value.trim() !== '')

// 状态栏实际展示的任务：搜索时仅保留标题或描述命中的卡片
const visibleTasks = computed(() => {
  const q = activeQuery.value.trim().toLowerCase()
  if (!q) return tasks.value
  return tasks.value.filter(
    t => t.title.toLowerCase().includes(q)
      || (t.description || '').toLowerCase().includes(q),
  )
})

function handleSearch(query) {
  activeQuery.value = (query || '').trim()
  if (activeQuery.value) {
    toast.success(`找到 ${visibleTasks.value.length} 个匹配任务 🔍`)
  }
}

function handleResetSearch() {
  activeQuery.value = ''
  toast('已返回，显示全部任务 ↩')
}

function openAddForm() {
  editingTask.value = null
  showForm.value = true
}

function openEditForm(task) {
  editingTask.value = { ...task }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingTask.value = null
}

function handleSave(formData) {
  if (editingTask.value) {
    updateTask(editingTask.value.id, formData)
    toast.success('任务已更新 ✏️')
  } else {
    addTask(formData)
    toast.success('新任务已创建 🎯')
  }
  closeForm()
}

// === 删除确认 ===
// 先弹窗确认，确认后才真正删除
const pendingDelete = ref(null)

function requestDelete(id) {
  pendingDelete.value = tasks.value.find(t => t.id === id) || null
}

function confirmDelete() {
  if (!pendingDelete.value) return
  deleteTask(pendingDelete.value.id)
  toast.success('任务已删除 🗑️')
  pendingDelete.value = null
}

function cancelDelete() {
  pendingDelete.value = null
}

function handleMove(id, newStatus) {
  moveTask(id, newStatus)
}
</script>

<template>
  <Toaster
    position="top-center"
    :theme="isDark ? 'dark' : 'light'"
    :rich-colors="false"
    toast-class="border-2 border-black shadow-brutal-sm font-bold !font-sans"
  />

  <div class="min-h-screen flex flex-col">
    <Header
      :is-dark="isDark"
      :stats="stats"
      :search-active="isSearchActive"
      @toggle-dark="toggleDark"
      @add-task="openAddForm"
      @search="handleSearch"
      @reset-search="handleResetSearch"
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <KanbanBoard
        :tasks="visibleTasks"
        :search-active="isSearchActive"
        @edit="openEditForm"
        @delete="requestDelete"
        @move="handleMove"
      />
    </main>

    <footer class="text-center py-4 text-sm text-stone-400 dark:text-stone-500 border-t-2 border-black dark:border-stone-600">
      <span class="font-bold">我的任务薄</span> · 新粗野主义手绘风格
    </footer>

    <!-- 新增 / 编辑 弹窗 -->
    <TaskForm
      v-if="showForm"
      :task="editingTask"
      @save="handleSave"
      @close="closeForm"
    />

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-if="pendingDelete"
      title="🗑️ 删除任务"
      :message="`确定要删除「${pendingDelete.title}」吗？删除后无法恢复。`"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
