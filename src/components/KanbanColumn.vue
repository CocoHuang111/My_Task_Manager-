<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  status: { type: Object, required: true },
  tasks: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete', 'move'])

// 列内可拖拽列表的本地副本
const list = ref([...props.tasks])

watch(() => props.tasks, (val) => {
  list.value = [...val]
}, { immediate: true })

function onChange(evt) {
  // added：从其他列拖入本列
  if (evt.added) {
    emit('move', {
      id: evt.added.element.id,
      status: props.status.value,
    })
  }
  // moved：列内重新排序（仅视觉，无需持久化状态）
}

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
</script>

<template>
  <div
    class="column-brutal rounded-none flex flex-col h-[calc(100vh-220px)] min-h-[400px]"
    :class="[statusBorder[status.value], 'border-t-4']"
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

    <!-- 拖拽容器 -->
    <draggable
      v-model="list"
      :group="{ name: 'tasks', pull: true, put: true }"
      item-key="id"
      class="flex-1 overflow-y-auto space-y-3 min-h-[60px] p-1"
      ghost-class="opacity-40"
      drag-class="!rotate-[-2deg] !shadow-brutal-lg"
      @change="onChange"
    >
      <template #item="{ element }">
        <TaskCard
          :task="element"
          @edit="emit('edit', element)"
          @delete="emit('delete', element.id)"
        />
      </template>
    </draggable>

    <!-- 空状态 -->
    <div
      v-if="tasks.length === 0"
      class="flex-1 flex items-center justify-center border-2 border-dashed border-stone-300 
             dark:border-stone-600 mt-2 p-4 text-stone-400 dark:text-stone-500 
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
  </div>
</template>

<style scoped>
/* 修复vuedraggable ghost样式 */
.sortable-ghost {
  opacity: 0.3;
  border: 2px dashed #000 !important;
}
.dark .sortable-ghost {
  border-color: #666 !important;
}
</style>