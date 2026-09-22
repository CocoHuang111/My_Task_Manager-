<script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import { useDragState } from '../composables/useDragState'

const props = defineProps({
  status: { type: Object, required: true },
  tasks: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete', 'move'])

const { draggingTaskId, dragOverStatus, setDragOver, endDrag } = useDragState()

// dragenter / dragleave 在子元素之间移动时会成对触发，用计数器判定"真正离开"
let enterCount = 0

// 悬停动效状态：有卡片拖拽中 && 悬停在当前列
const isDragOver = computed(
  () => draggingTaskId.value !== null && dragOverStatus.value === props.status.value,
)

const statusEmoji = {
  todo: '📝',
  'in-progress': '⚡',
  done: '✅',
}

const statusBorder = {
  todo: 'border-t-blue-300',
  'in-progress': 'border-t-amber-300',
  done: 'border-t-green-300',
}

// 悬停高亮：整列变色 + 外圈 ring + 阴影加深（不用 transform，避免放置区位移导致闪烁）
const dragOverClass = {
  todo: ['bg-blue-100', 'dark:bg-blue-900/40', 'ring-blue-400/60'],
  'in-progress': ['bg-amber-100', 'dark:bg-amber-900/40', 'ring-amber-400/60'],
  done: ['bg-green-100', 'dark:bg-green-900/40', 'ring-green-400/60'],
}

const hintTextClass = {
  todo: 'text-blue-600 dark:text-blue-300',
  'in-progress': 'text-amber-600 dark:text-amber-300',
  done: 'text-green-600 dark:text-green-300',
}

function onDragEnter() {
  if (draggingTaskId.value === null) return
  enterCount++
  setDragOver(props.status.value)
}

function onDragOver(e) {
  // 仅任务卡片拖拽时允许放置；dragover 必须 preventDefault 才能接收 drop
  if (draggingTaskId.value === null) return
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

function onDragLeave() {
  if (draggingTaskId.value === null) return
  enterCount = Math.max(0, enterCount - 1)
  if (enterCount === 0) setDragOver(null)
}

function onDrop(e) {
  e.preventDefault()
  enterCount = 0
  if (draggingTaskId.value === null) return
  const id = e.dataTransfer.getData('text/plain') || draggingTaskId.value
  if (id) emit('move', id, props.status.value)
  endDrag()
}
</script>

<template>
  <!-- 整列（含标题、卡片区、空白区、底部）都是放置区 -->
  <div
    class="column-brutal rounded-none flex flex-col h-[calc(100vh-220px)] min-h-[400px]
           transition-all duration-200 ease-out"
    :class="[
      statusBorder[status.value],
      'border-t-4',
      isDragOver ? ['ring-4', 'shadow-brutal-lg', 'z-10', ...dragOverClass[status.value]] : [],
    ]"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- 列标题 -->
    <div class="flex items-center justify-between mb-3 pb-2 border-b-2 border-black dark:border-stone-500">
      <h2 class="text-2xl font-bold text-brutal-heading flex items-center gap-2">
        <span>{{ statusEmoji[status.value] }}</span>
        {{ status.label }}
      </h2>
      <span class="text-sm font-bold px-2 py-0.5 border-2 border-black
                  shadow-brutal-sm bg-white dark:bg-stone-700
                  dark:shadow-[2px_2px_0px_#fff]">
        {{ tasks.length }}
      </span>
    </div>

    <!-- 卡片列表：直接由 props 渲染，无本地副本 -->
    <div class="flex-1 overflow-y-auto space-y-3 min-h-[60px] p-1">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', task)"
        @delete="emit('delete', task.id)"
      />
    </div>

    <!-- 空状态提示：无虚线框，整列可拖入 -->
    <div
      v-if="tasks.length === 0"
      class="flex items-center justify-center py-8 text-stone-400 dark:text-stone-500
             font-bold text-lg select-none"
    >
      <div class="text-center">
        <span class="text-3xl block mb-1">
          {{ status.value === 'todo' ? '📭' : status.value === 'in-progress' ? '🔄' : '🎉' }}
        </span>
        <span v-if="status.value === 'todo'">拖拽任务到此处</span>
        <span v-else-if="status.value === 'in-progress'">暂无进行中的任务</span>
        <span v-else>暂无已完成的任务</span>
      </div>
    </div>

    <!-- 拖拽悬停提示（动效） -->
    <div
      v-if="isDragOver"
      class="py-2 text-center text-sm font-bold select-none animate-bounce"
      :class="hintTextClass[status.value]"
    >
      👇 松手放入「{{ status.label }}」
    </div>
  </div>
</template>