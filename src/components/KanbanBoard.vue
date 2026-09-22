<script setup>
import KanbanColumn from './KanbanColumn.vue'
import { STATUS_LIST } from '../utils/helpers'

defineProps({
  tasks: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete', 'move'])

function onMove(evt) {
  emit('move', evt.id, evt.status)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <KanbanColumn
      v-for="col in STATUS_LIST"
      :key="col.value"
      :status="col"
      :tasks="tasks.filter(t => t.status === col.value)"
      @edit="(task) => emit('edit', task)"
      @delete="(id) => emit('delete', id)"
      @move="onMove"
    />
  </div>
</template>