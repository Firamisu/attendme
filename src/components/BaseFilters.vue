<template>
  <div class="search-container">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="props.placeholder || 'Search...'"
      class="search-input"
    />

    <select v-model="selectedFilter" class="filter-select">
      <option value="" disabled>Select filters</option>
      <option v-for="opt in props.options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface FilterOption {
  label: string;
  value: string | number;
}

const props = defineProps<{
  placeholder?: string;
  options: FilterOption[];
}>();

const emit = defineEmits<{
  (e: "change", payload: { search: string; filter: string }): void;
}>();

const searchQuery = ref("");
const selectedFilter = ref("");

watch([searchQuery, selectedFilter], () => {
  emit("change", {
    search: searchQuery.value,
    filter: selectedFilter.value,
  });
});
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  font-family: sans-serif;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #007bff;
}
</style>
