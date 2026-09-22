import { ref } from 'vue'

// 模块级共享状态：所有组件实例共用同一份拖拽上下文
const draggingTaskId = ref(null) // 当前正在拖拽的卡片 id
const dragOverStatus = ref(null) // 当前悬停的状态栏 status

export function useDragState() {
  function startDrag(id) {
    draggingTaskId.value = id
  }

  function endDrag() {
    draggingTaskId.value = null
    dragOverStatus.value = null
  }

  function setDragOver(status) {
    dragOverStatus.value = status
  }

  return {
    draggingTaskId,
    dragOverStatus,
    startDrag,
    endDrag,
    setDragOver,
  }
}