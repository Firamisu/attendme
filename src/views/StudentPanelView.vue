<template>
  <div
    class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen text-black"
  >
    <div class="border-2 border-black p-4 bg-gray-50">
      <BaseFilters
        :options="[
          { label: 'Today', value: 'today' },
          { label: 'Week ahead', value: 'week-ahead' },
          { label: 'Month ahead', value: 'month-ahead' },
          { label: 'Future', value: 'future' },
          { label: 'Past', value: 'past' },
          { label: 'All', value: 'all' },
        ]"
        placeholder="Search course sessions..."
        @change="getSessions(1, $event)"
        class="flex flex-col md:flex-row gap-4 uppercase font-bold text-sm"
      />
    </div>

    <div class="bg-white">
      <BaseTable
        class="w-full"
        v-if="sessions?.items.length !== 0"
        :headers="{
          courseName: { name: 'Course name', type: 'string' },
          courseGroupName: { name: 'Course group name', type: 'string' },
          locationName: { name: 'Location name', type: 'string' },
          dateStart: { name: 'Start date', type: 'date' },
          dateEnd: { name: 'End date', type: 'date' },
        }"
        :items="sessions?.items || []"
        :actions="[{ name: 'View', action: viewSession }]"
        :pageNumber="sessions?.pageNumber || 1"
        :pageSize="sessions?.pageSize || 10"
        :totalPages="sessions?.totalPages || 1"
        :totalCount="sessions?.totalCount || 0"
        @changePage="getSessions"
      />

      <div
        v-else
        class="border-2 border-black p-20 text-center uppercase font-black tracking-widest text-gray-400"
      >
        No sessions found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CourseSessionListFilters,
  CourseSessionListItemPagedList,
} from "@/backend/AttendMeBackendClientBase";
import BaseFilters from "@/components/BaseFilters.vue";
import BaseTable from "@/components/BaseTable.vue";
import { Backend } from "@/main";
import type { Item } from "@/types/types";
import { ref } from "vue";

const sessions = ref<CourseSessionListItemPagedList | null>(null);
let currentFilter: { search?: string; filter?: string } = {};

getSessions();

function viewSession(el: Item): void {
  console.log(el);
}

async function getSessions(
  pageNumber: number = 1,
  filter: { search?: string; filter?: string } | null = null,
) {
  if (filter != null) {
    currentFilter = filter;
  }

  await Backend.courseStudentSessionsGet({
    pageNumber,
    pageSize: 5,
    filters: buildFilter(currentFilter),
  })
    .then((response) => {
      sessions.value = response;
    })
    .catch((error) => {
      console.log(error);
    });
}

function buildFilter(filter: {
  search?: string;
  filter?: string;
}): CourseSessionListFilters {
  const filters: CourseSessionListFilters = {};

  if (filter.search) {
    filters.search = filter.search;
  }

  if (filter.filter) {
    switch (filter.filter) {
      case "today": {
        filters.dateStart = begginingOfDay(new Date());
        filters.dateEnd = endOfDay(new Date());
        break;
      }
      case "week-ahead": {
        const now = new Date();
        const weekAhead = new Date();
        weekAhead.setDate(now.getDate() + 7);

        filters.dateStart = begginingOfDay(now);
        filters.dateEnd = endOfDay(weekAhead);
        break;
      }
      case "month-ahead": {
        const now = new Date();
        const monthAhead = new Date();
        monthAhead.setMonth(now.getMonth() + 1);

        filters.dateStart = begginingOfDay(now);
        filters.dateEnd = endOfDay(monthAhead);
        break;
      }
      case "future": {
        filters.dateStart = new Date();
        break;
      }
      case "past": {
        filters.dateEnd = endOfDay(new Date());
        break;
      }
    }
  }

  function begginingOfDay(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );
  }

  function endOfDay(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999,
    );
  }

  return filters;
}
</script>

<style scoped></style>
