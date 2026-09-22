<script setup>
import { ref, computed } from 'vue'
import { Toaster, toast } from 'vue-sonner'
import Header from './components/Header.vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskForm from './components/TaskForm.vue'
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

function handleDelete(id) {
  deleteTask(id)
  toast.success('任务已删除 🗑️')
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
      @toggle-dark="toggleDark"
      @add-task="openAddForm"
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <KanbanBoard
        :tasks="tasks"
        @edit="openEditForm"
        @delete="handleDelete"
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
  </div>
</template>