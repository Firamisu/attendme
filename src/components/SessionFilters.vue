<template>
  <section class="mb-8">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="block text-lg font-bold mb-1">Wybierz filtry</label>
        <select
          v-model="dateFilterI"
          class="w-full p-3 border-4 border-black bg-white text-lg font-medium appearance-none brutal-shadow-sm"
        >
          <option value="" disabled>Wybierz filtry</option>
          <option
            v-for="opt in props.options"
            :key="opt.type"
            :value="opt.type"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="flex-1">
        <label class="block text-lg font-bold mb-1"
          >Przedmiot, grupa, lokalizacje</label
        >
        <input
          v-model="searchQueryI"
          type="text"
          placeholder="Szukaj..."
          class="w-full p-3 border-4 border-black bg-white text-lg font-medium brutal-shadow-sm"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DateFilterOptionType } from "@/types/session";
import { ref, watch } from "vue";

interface DateFilterOption {
  label: string;
  type: DateFilterOptionType;
}

const props = defineProps<{
  options: DateFilterOption[];
  dateFilter?: DateFilterOptionType;
  search?: string;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "update:dateFilter", value: DateFilterOptionType): void;
}>();

const searchQueryI = ref<string>(props.search || "");
const dateFilterI = ref<DateFilterOptionType>(props.dateFilter || "all");

watch(searchQueryI, (newVal: string) => {
  emit("update:search", newVal.trim());
});

watch(dateFilterI, (newVal: DateFilterOptionType) => {
  emit("update:dateFilter", newVal);
});
</script>
