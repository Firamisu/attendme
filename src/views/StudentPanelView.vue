<template>
  <BaseTable
    class="table"
    :v-if="sessions?.items.length !== 0"
    :headers="{
      courseName: { name: 'Course name', type: 'string' },
      courseGroupName: { name: 'Course group name', type: 'string' },
      locationName: { name: 'Location name', type: 'string' },
      dateStart: { name: 'Start date', type: 'date' },
      dateEnd: { name: 'End date', type: 'date' },
    }"
    :items="sessions?.items || []"
    :pageNumber="sessions?.pageNumber || 1"
    :pageSize="sessions?.pageSize || 10"
    :totalPages="sessions?.totalPages || 1"
    :totalCount="sessions?.totalCount || 0"
    @changePage="getSessions"
  />
</template>

<script setup lang="ts">
import type { CourseSessionListItemPagedList } from "@/backend/AttendMeBackendClientBase";
import BaseTable from "@/components/BaseTable.vue";
import { Backend } from "@/main";
import { ref } from "vue";

const sessions = ref<CourseSessionListItemPagedList | null>(null);

getSessions();

async function getSessions(pageNumber: number = 1) {
  await Backend.courseStudentSessionsGet({
    pageNumber,
    pageSize: 2,
  })
    .then((response) => {
      sessions.value = response;
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<style scoped>
.table {
  margin-top: 1rem;
  width: 800px;
}
</style>
