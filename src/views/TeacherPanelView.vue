<template>
  <div
    class="bg-white text-black px-4 py-6 max-w-screen-xl mx-auto min-h-screen"
  >
    <SessionFilters
      :options="[
        { label: 'Dzisiaj', type: 'today' },
        { label: 'Tydzień naprzód', type: 'week-ahead' },
        { label: 'Miesiąc naprzód', type: 'month-ahead' },
        { label: 'Przyszłe', type: 'future' },
        { label: 'Przeszłe', type: 'past' },
        { label: 'Wszystkie', type: 'all' },
      ]"
      @update:date-filter="updateDateFilter"
      @update:search="updateSearch"
    />

    <SessionGrid role="teacher" :items="sessions || []" />

    <div
      v-if="sessions && sessions.length === 0"
      class="text-center py-12 text-xl font-black text-gray-600"
    >
      Brak zajęć spełniających filtry
    </div>

    <div
      v-if="error"
      class="bg-red-600 text-white font-black text-md uppercase px-1 py-1 border-4 border-black text-center mt-6"
    >
      {{ error }}
    </div>

    <button
      v-if="sessions && sessions.length > 0 && canFetchMore()"
      @click="fetchMore"
      class="mt-6 w-full bg-white text-black font-black text-xl uppercase py-5 border-4 border-black brutal-shadow"
    >
      Załaduj więcej
    </button>
  </div>
</template>

<script setup lang="ts">
import SessionFilters from "@/components/SessionFilters.vue";
import SessionGrid from "@/components/SessionGrid.vue";
import { useSessionList } from "@/composables/useSessionList";

const {
  sessions,
  error,
  canFetchMore,
  fetchMore,
  updateDateFilter,
  updateSearch,
} = useSessionList("teacher");
</script>
