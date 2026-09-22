<script setup>
import { ref, watch } from 'vue'
import { PRIORITY_CONFIG } from '../utils/helpers'

const props = defineProps({
  task: { type: Object, default: null },
})

const emit = defineEmits(['save', 'close'])

const isEdit = !!props.task

const title = ref('')
const description = ref('')
const priority = ref('medium')

// 编辑模式回填
watch(
  () => props.task,
  (val) => {
    if (val) {
      title.value = val.title || ''
      description.value = val.description || ''
      priority.value = val.priority || 'medium'
    } else {
      title.value = ''
      description.value = ''
      priority.value = 'medium'
    }
  },
  { immediate: true },
)

function handleSubmit() {
  const trimmed = title.value.trim()
  if (!trimmed) return
  emit('save', {
    title: trimmed,
    description: description.value.trim(),
    priority: priority.value,
  })
}

function handleKeydown(e) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
}
</script>

<template>
  <Teleport to="body">
    <!-- 遮罩层 -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      @click.self="emit('close')"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <!-- 弹窗 -->
      <div
        class="card-brutal w-full max-w-lg animate-slide-up"
        @click.stop
      >
        <!-- 标题区 -->
        <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-black dark:border-stone-500">
          <h2 class="text-2xl font-bold text-brutal-heading">
            {{ isEdit ? '✏️ 编辑任务' : '📝 新建任务' }}
          </h2>
          <button
            class="btn-brutal btn-brutal-sm !px-2 !py-0.5 text-lg leading-none"
            @click="emit('close')"
            title="关闭"
          >
            ✕
          </button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-sm font-bold mb-1">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="title"
              type="text"
              class="input-brutal"
              placeholder="输入任务标题…"
              maxlength="100"
              required
              autofocus
            />
          </div>

          <!-- 描述 -->
          <div>
            <label class="block text-sm font-bold mb-1">
              描述 <span class="text-stone-400 dark:text-stone-500">(选填)</span>
            </label>
            <textarea
              v-model="description"
              class="input-brutal min-h-[80px] resize-y"
              placeholder="输入任务描述…"
              maxlength="500"
              rows="3"
            />
          </div>

          <!-- 优先级 -->
          <div>
            <label class="block text-sm font-bold mb-1">优先级</label>
            <div class="flex gap-2">
              <button
                v-for="(cfg, key) in PRIORITY_CONFIG"
                :key="key"
                type="button"
                class="flex-1 px-3 py-2 border-2 font-bold text-sm transition-all duration-75"
                :class="[
                  priority === key
                    ? `${cfg.color} ${cfg.textColor} shadow-brutal-sm -translate-y-[1px]`
                    : 'bg-white dark:bg-stone-700 border-black dark:border-stone-400 hover:shadow-brutal-sm',
                ]"
                @click="priority = key"
              >
                {{ cfg.label }}
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-2 pt-2 border-t-2 border-black dark:border-stone-500">
            <button
              type="button"
              class="btn-brutal"
              @click="emit('close')"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn-brutal-primary"
              :disabled="!title.trim()"
            >
              {{ isEdit ? '保存修改' : '创建任务' }}
            </button>
          </div>
        </form>

        <!-- 快捷键提示 -->
        <p class="mt-2 text-xs text-stone-400 dark:text-stone-500 text-right">
          <kbd class="px-1 border border-stone-300 dark:border-stone-600 text-[10px]">Esc</kbd> 关闭 ·
          <kbd class="px-1 border border-stone-300 dark:border-stone-600 text-[10px]">⌘+Enter</kbd> 提交
        </p>
      </div>
    </div>
  </Teleport>
</template>