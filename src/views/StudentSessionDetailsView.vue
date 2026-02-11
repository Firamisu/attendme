<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen text-black">
    <div class="mb-4 flex flex-wrap gap-4 items-center justify-between">
      <button
        @click="goBack"
        class="border-2 border-black px-4 py-2 font-bold uppercase hover:bg-black hover:text-white rounded-lg"
      >
        ← Back to Sessions
      </button>
      
    </div>

    <div v-if="error" class="border-2 border-red-600 p-4 text-red-600 rounded-lg">
      <p class="font-bold">Error: {{ error }}</p>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-6">Session Details</h1>

      <div v-if="sessionDetails" class="mt-4 border-2 border-black p-4 rounded-lg bg-gray-50">
        <h2 class="text-xl font-bold mb-2">Session Signature</h2>
        <p class="font-bold">
          {{ sessionDetails.courseName }} | {{ sessionDetails.courseGroupName }}
        </p>
        <p class="text-gray-600">Session ID: {{ sessionId }}</p>
        <p
          v-if="sessionDetails.dateStart && sessionDetails.dateEnd"
          class="text-sm text-gray-700"
        >
          {{ sessionDetails.dateStart.toLocaleString() }}
          –
          {{ sessionDetails.dateEnd.toLocaleString() }}
        </p>
        <p v-if="locationLabel" class="text-sm text-gray-700 mt-1">
          {{ locationLabel }}
        </p>
        <p
          v-if="presentLabel"
          class="mt-3 inline-flex items-center px-3 py-1.5 text-base font-bold rounded-md"
          :class="presentClass"
        >
          {{ presentLabel }}
        </p>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Attendance History</h2>

        <div v-if="attendanceLogs.length === 0" class="border-2 border-black p-10 text-center rounded-lg">
          <p class="text-gray-400 font-bold">No attendance records for this course group.</p>
        </div>

        <BaseTable
          v-else
          :items="attendanceLogs"
          :headers="{
            courseSessionId: { name: 'Session ID', type: 'number' },
            dateCreated: { name: 'Marked at', type: 'date' }
          }"
          :actions="[]"
          :pageNumber="1"
          :pageSize="attendanceLogs.length"
          :totalPages="1"
          :totalCount="attendanceLogs.length"
          @changePage="() => {}"
        />
      </div>

      <div class="mt-8 border-2 border-black p-4 rounded-lg bg-gray-50">
        <h2 class="text-2xl font-bold mb-4">Attendance Progress</h2>
        <p class="text-sm text-gray-700 mb-2">
          Attended: {{ attendedSessionsCount }} / {{ totalSessionsCount }}
        </p>
        <div class="w-full h-4 border-2 border-black rounded-full bg-white overflow-hidden">
          <div
            class="h-full bg-blue-500"
            :style="{ width: attendancePercent + '%' }"
          />
        </div>
        <p class="text-sm font-bold mt-2">{{ attendancePercent }}%</p>
      </div>

      <div class="mt-8 border-2 border-black p-4 rounded-lg bg-gray-50">
        <h2 class="text-2xl font-bold mb-4">Course Progress</h2>
        <p class="text-sm text-gray-700 mb-2">
          Completed: {{ pastSessionsCount }} / {{ totalSessionsCount }}
        </p>
        <div class="w-full h-4 border-2 border-black rounded-full bg-white overflow-hidden">
          <div
            class="h-full bg-green-500"
            :style="{ width: progressPercent + '%' }"
          />
        </div>
        <p class="text-sm font-bold mt-2">{{ progressPercent }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Backend } from "@/main";
import type { AttendanceLog, CourseSessionListItem } from "@/backend/AttendMeBackendClientBase";
import BaseTable from "@/components/BaseTable.vue";

const route = useRoute();
const router = useRouter();

const sessionId = Number(route.params.id);
const courseGroupId = Number(route.params.groupId);

const sessionDetails = ref<CourseSessionListItem | null>(null);
const allSessions = ref<CourseSessionListItem[]>([]);
const attendanceLogs = ref<AttendanceLog[]>([]);
const error = ref<string | null>(null);

function goBack() {
  router.push({ name: "student-panel" });
}

async function fetchSessionDetails() {
  error.value = null;
  try {
    const sessions = await Backend.courseStudentGroupSessionsGet(courseGroupId);
    allSessions.value = sessions || [];
    const match = allSessions.value.find((s) => s.courseSessionId === sessionId) || null;
    sessionDetails.value = match;

    const logs = await Backend.courseStudentAttendanceGet(courseGroupId);
    attendanceLogs.value = logs || [];
  } catch (err: any) {
    error.value = err.message || "Failed to load session details";
  }
}

const locationLabel = computed(() => {
  if (!sessionDetails.value) return "";
  const locationName = sessionDetails.value.locationName;
  if (locationName && locationName.trim().length > 0) {
    return `Location: ${locationName}`;
  }
  return "";
});

const presentLabel = computed(() => {
  if (!sessionDetails.value) return "";
  const present = attendanceLogs.value.some(
    (log) => log.courseSessionId === sessionId,
  );
  return present ? "Present: YES" : "Present: NO";
});

const presentClass = computed(() => {
  if (!sessionDetails.value) return "";
  const present = attendanceLogs.value.some(
    (log) => log.courseSessionId === sessionId,
  );
  return present
    ? "bg-green-500 text-white"
    : "bg-red-500 text-white";
});

const totalSessionsCount = computed(() => allSessions.value.length);
const attendedSessionsCount = computed(() => {
  const unique = new Set(attendanceLogs.value.map((l) => l.courseSessionId));
  unique.delete(undefined);
  return unique.size;
});
const pastSessionsCount = computed(() => {
  const now = Date.now();
  return allSessions.value.filter((s) => {
    if (!s.dateEnd) return false;
    return s.dateEnd.getTime() < now;
  }).length;
});
const attendancePercent = computed(() => {
  if (totalSessionsCount.value === 0) return 0;
  return Math.round(
    (attendedSessionsCount.value / totalSessionsCount.value) * 100,
  );
});
const progressPercent = computed(() => {
  if (totalSessionsCount.value === 0) return 0;
  return Math.round((pastSessionsCount.value / totalSessionsCount.value) * 100);
});

onMounted(() => {
  fetchSessionDetails();
});
</script>

<style scoped></style>
