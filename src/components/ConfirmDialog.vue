<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

defineProps({
  title: { type: String, default: '确认操作' },
  message: { type: String, required: true },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
})

const emit = defineEmits(['confirm', 'cancel'])

// Esc 关闭（等同取消）
function onKeydown(e) {
  if (e.key === 'Escape') emit('cancel')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <!-- 遮罩层：点击空白处取消 -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4
             bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      @click.self="emit('cancel')"
    >
      <!-- 弹窗 -->
      <div class="card-brutal w-full max-w-sm animate-slide-up">
        <h2 class="text-2xl font-bold text-brutal-heading mb-3">
          {{ title }}
        </h2>

        <p class="mb-5 break-words">
          {{ message }}
        </p>

        <div class="flex justify-end gap-2 pt-3 border-t-2 border-black dark:border-stone-500">
          <button
            class="btn-brutal"
            @click="emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            class="btn-brutal-danger"
            @click="emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>

        <p class="mt-2 text-xs text-stone-400 dark:text-stone-500 text-right">
          <kbd class="px-1 border border-stone-300 dark:border-stone-600 text-[10px]">Esc</kbd> 取消
        </p>
      </div>
    </div>
  </Teleport>
</template>