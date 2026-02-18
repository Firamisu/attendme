<template>
  <section class="space-y-6">
    <article
      v-for="item in items"
      :key="item.courseSessionId"
      @click="redirectToDetails(item)"
      class="border-4 border-black bg-white brutal-shadow p-5 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div class="flex justify-between items-start mb-3">
        <h3
          v-if="item.dateStart && item.dateEnd"
          class="text-xl font-black uppercase tracking-wide"
        >
          {{ getWeekDayName(item.dateStart) }}
          {{ getTimeString(item.dateStart) }} -
          {{ getTimeString(item.dateEnd) }}
        </h3>
        <span
          class="inline-block bg-black text-white px-3 py-1 text-sm font-bold"
        >
          {{ item.courseGroupName }}
        </span>
      </div>

      <h2 class="text-2xl font-bold mb-2 leading-tight">
        {{ item.courseName }}
      </h2>

      <div class="space-y-1 text-lg">
        <div>{{ item.courseGroupName }} / {{ item.courseGroupId }}</div>
        <div class="font-black">{{ item.locationName }}</div>
        <div class="text-gray-700">
          {{ item.dateStart?.toLocaleDateString("pl-PL") }}
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { CourseSessionListItem } from "@/backend/AttendMeBackendClientBase";
import { getTimeString, getWeekDayName } from "@/helpers/time";
import type { Role } from "@/types/auth";
import { useRouter } from "vue-router";

const props = defineProps<{
  items: CourseSessionListItem[];
  role: Role;
}>();

const router = useRouter();

function redirectToDetails(item: CourseSessionListItem): void {
  if (props.role == "teacher") {
    router.push({
      name: "teacher-session-details",
      params: { id: item.courseSessionId },
    });
  } else {
    router.push({
      name: "student-session-details",
      params: { id: item.courseSessionId, groupId: item.courseGroupId },
    });
  }
}
</script>
