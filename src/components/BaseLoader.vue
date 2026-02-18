<template>
  <div
    class="fixed inset-0 bg-[#ffffffad] flex items-center justify-center z-60"
  >
    <div
      class="border-4 border-black bg-white brutal-shadow p-8 flex flex-col items-center gap-6 min-w-[320px] max-w-[90vw]"
    >
      <div class="flex gap-4">
        <div
          class="w-8 h-8 border-8 border-black border-x-2 animate-spin"
        ></div>
        <div
          class="w-8 h-8 border-8 border-black border-x-2 animate-spin"
        ></div>
        <div
          class="w-8 h-8 border-8 border-black border-x-2 animate-spin"
        ></div>
      </div>
      <div class="text-center space-y-2">
        <p class="text-2xl font-black uppercase tracking-tight">
          {{ loadingMessage || "ŁADOWANIE" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loadingMessage?: string;
}>();
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1.2s linear infinite;
}
</style>
