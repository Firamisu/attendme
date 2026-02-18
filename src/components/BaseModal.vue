<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#0007] p-4 transition-opacity duration-200"
      @click.self="!disableCloseOnOverlay && close()"
    >
      <div
        :class="[
          'border-4 border-black bg-white brutal-shadow',
          'transform transition-all duration-300',
          size === 'sm'
            ? 'max-w-sm w-full'
            : size === 'lg'
              ? 'max-w-4xl w-full'
              : size === 'xl'
                ? 'max-w-6xl w-full'
                : 'max-w-2xl w-full',
        ]"
      >
        <div
          v-if="title"
          class="flex items-center justify-between px-6 py-5 border-b-4 border-black bg-white"
        >
          <h2 class="text-2xl font-black uppercase tracking-tight">
            {{ title }}
          </h2>
          <button
            @click="close"
            class="text-black font-black text-2xl leading-none hover:bg-black hover:text-white px-3 py-1 -mr-3 -my-1 transition-colors"
          >
            ×
          </button>
        </div>

        <div class="p-6 max-h-[80vh] overflow-y-auto">
          <slot name="content"></slot>
          <slot></slot>
        </div>

        <div
          v-if="$slots.footer"
          class="px-6 py-5 border-t-4 border-black flex justify-end gap-4 bg-white"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

defineProps<{
  modelValue: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  disableCloseOnOverlay?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

// ESC key handling for closing the modal
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

onMounted(() => {
  document.addEventListener("keydown", handleEsc);
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEsc);
  document.body.style.overflow = "";
});
</script>
