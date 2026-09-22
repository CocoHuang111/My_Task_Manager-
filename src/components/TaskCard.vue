<script setup>
import { PRIORITY_CONFIG, formatDate } from '../utils/helpers'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const priority = PRIORITY_CONFIG[props.task.priority]
</script>

<template>
  <div
    class="card-brutal group cursor-grab active:cursor-grabbing 
           hover:rotate-[-1deg] hover:shadow-brutal-lg transition-all duration-150
           relative overflow-hidden animate-fade-in"
  >
    <!-- 优先级色条 -->
    <div
      class="absolute top-0 left-0 w-1.5 h-full"
      :class="priority.color"
    />

    <div class="pl-3">
      <!-- 头部：优先级标签 + 时间 -->
      <div class="flex items-center justify-between gap-2 mb-1.5">
        <span
          class="text-xs font-bold px-1.5 py-0.5 border border-black"
          :class="[priority.color, priority.textColor]"
        >
          {{ priority.label }}
        </span>
        <span class="text-xs text-stone-400 dark:text-stone-500 font-bold">
          {{ formatDate(task.createdAt) }}
        </span>
      </div>

      <!-- 标题 -->
      <h3 class="text-lg font-bold text-brutal-heading mb-1 break-words">
        {{ task.title }}
      </h3>

      <!-- 描述（截断） -->
      <p
        v-if="task.description"
        class="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 break-words"
      >
        {{ task.description }}
      </p>

      <!-- 操作按钮 -->
      <div
        class="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
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
</template>