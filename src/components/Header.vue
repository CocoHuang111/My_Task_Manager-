<script setup>
defineProps({
  isDark: Boolean,
  stats: Object,
})

const emit = defineEmits(['toggle-dark', 'add-task'])
</script>

<template>
  <header class="border-b-2 border-black dark:border-stone-300 bg-white dark:bg-stone-900 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
      <!-- 左侧：标题 -->
      <div class="flex items-center gap-3">
        <h1 class="text-3xl md:text-4xl font-bold text-brutal-heading tracking-wide
                   hover:rotate-[-1deg] transition-transform cursor-default select-none">
          📋 我的任务薄
        </h1>
        <span class="hidden sm:block text-sm text-stone-400 dark:text-stone-500 font-bold">
          My Task Manager
        </span>
      </div>

      <!-- 中间：统计 -->
      <div class="hidden md:flex items-center gap-3 text-sm font-bold">
        <span class="px-2 py-1 border-2 border-black dark:border-stone-300 
                     shadow-brutal-sm bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
          待办 {{ stats.todo }}
        </span>
        <span class="px-2 py-1 border-2 border-black dark:border-stone-300 
                     shadow-brutal-sm bg-amber-100 dark:bg-amber-900 dark:text-amber-100">
          进行 {{ stats['in-progress'] }}
        </span>
        <span class="px-2 py-1 border-2 border-black dark:border-stone-300 
                     shadow-brutal-sm bg-green-100 dark:bg-green-900 dark:text-green-100">
          完成 {{ stats.done }}
        </span>
        <span class="text-stone-400 dark:text-stone-500">|</span>
        <span class="text-stone-500 dark:text-stone-400">共 {{ stats.total }} 项</span>
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="flex items-center gap-2">
        <!-- 新增按钮 -->
        <button
          class="btn-brutal-primary !px-4 !py-2 flex items-center gap-1 text-lg"
          @click="emit('add-task')"
          title="新增任务"
        >
          <span class="text-xl leading-none">+</span>
          <span class="hidden sm:inline">新增</span>
        </button>

        <!-- 深色模式切换 -->
        <button
          class="btn-brutal !p-2 text-xl min-w-[44px] flex items-center justify-center"
          @click="emit('toggle-dark')"
          :title="isDark ? '切换亮色模式' : '切换深色模式'"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </div>
  </header>
</template>