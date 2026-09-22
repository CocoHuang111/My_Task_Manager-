<script setup>
import { computed } from 'vue'
import { PRIORITY_CONFIG, formatDate } from '../utils/helpers'
import { useDragState } from '../composables/useDragState'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const priority = computed(() => PRIORITY_CONFIG[props.task.priority] ?? PRIORITY_CONFIG.medium)

const { draggingTaskId, startDrag, endDrag } = useDragState()

// 当前卡片是否正在被拖拽（原位卡片半透明倾斜）
const isDragging = computed(() => draggingTaskId.value === props.task.id)

function onDragStart(e) {
  // Firefox 必须调用 setData 才能触发拖拽
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.task.id)
  startDrag(props.task.id)
}

function onDragEnd() {
  endDrag()
}

// 点击卡片本身 = 开始编辑（拖拽结束后浏览器不会触发 click，二者不冲突）
function onCardClick() {
  emit('edit', props.task)
}
</script>

<template>
  <div
    draggable="true"
    class="card-brutal cursor-pointer active:cursor-grabbing select-none
           hover:rotate-[-1deg] hover:shadow-brutal-lg transition-all duration-150
           relative overflow-hidden animate-fade-in"
    :class="isDragging ? 'opacity-40 rotate-2 scale-95' : ''"
    title="点击编辑任务，拖拽移动状态"
    @click="onCardClick"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- 优先级色条 -->
    <div
      class="absolute top-0 left-0 w-1.5 h-full"
      :class="priority.color"
    />

    <div class="pl-3 flex gap-3">
      <!-- 左侧：主内容（优先级 + 标题 + 描述） -->
      <div class="flex-1 min-w-0">
        <span
          class="inline-block text-xs font-bold px-1.5 py-0.5 border border-black"
          :class="[priority.color, priority.textColor]"
        >
          {{ priority.label }}
        </span>

        <h3 class="text-lg font-bold text-brutal-heading mt-1.5 mb-1 break-words">
          {{ task.title }}
        </h3>

        <p
          v-if="task.description"
          class="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 break-words"
        >
          {{ task.description }}
        </p>
      </div>

      <!-- 右侧：日期 + 操作按钮（按钮位于日期下方） -->
      <div class="flex flex-col items-end gap-1.5 shrink-0">
        <span class="text-xs text-stone-400 dark:text-stone-500 font-bold whitespace-nowrap">
          {{ formatDate(task.createdAt) }}
        </span>

        <div class="flex items-center gap-1.5">
          <button
            class="btn-brutal btn-brutal-sm !px-2 !py-0.5 text-xs"
            @click.stop="emit('edit', task)"
            title="编辑"
          >
            ✏️
          </button>
          <button
            class="btn-brutal-danger btn-brutal-sm !px-2 !py-0.5 text-xs"
            @click.stop="emit('delete', task.id)"
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>