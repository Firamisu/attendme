<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen text-black">
    <div class="mb-4 flex flex-wrap gap-4 items-center justify-between">
      <button 
        @click="goBack"
        class="border-2 border-black px-4 py-2 font-bold uppercase hover:bg-black hover:text-white rounded-lg"
      >
        ← Back to Sessions
      </button>
      
      <div class="flex gap-4">
        <button 
          @click="refreshAttendanceList"
          :disabled="isRefreshing"
          class="border-2 border-sky-300 bg-sky-300 text-black px-4 py-2 font-bold uppercase hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
        >
          {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
        </button>

        
      </div>
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
      </div>
      
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Attendance List</h2>
        
        <div v-if="attendanceList.length === 0" class="border-2 border-black p-10 text-center rounded-lg">
          <p class="text-gray-400 font-bold">No students registered for this session.</p>
        </div>
        
        <BaseTable
          v-else
          :items="attendanceList"
          :headers="{
            userName: { name: 'First Name', type: 'string' },
            userSurname: { name: 'Last Name', type: 'string' },
            studentAlbumIdNumber: { name: 'Student ID', type: 'number' },
            wasUserPresent: { name: 'Present', type: 'boolean' },
            attendanceLogMinDateCreated: { name: 'Marked at', type: 'date' }
          }"
          :actions="[]"
          :pageNumber="1"
          :pageSize="attendanceList.length"
          :totalPages="1"
          :totalCount="attendanceList.length"
          @changePage="() => {}"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Backend } from "@/main";
import type { CourseSessionAttendanceRecord, CourseSessionListItem } from "@/backend/AttendMeBackendClientBase";
import BaseTable from "@/components/BaseTable.vue";

const route = useRoute();
const router = useRouter();

const sessionId = Number(route.params.id);

const attendanceList = ref<CourseSessionAttendanceRecord[]>([]);
const sessionDetails = ref<CourseSessionListItem | null>(null);
const error = ref<string | null>(null);
const isRefreshing = ref<boolean>(false);

function goBack() {
  router.push({ name: "teacher-panel" });
}

async function fetchSessionDetails() {
  console.log("Pobieranie szczegółów sesji:", sessionId);
  
  error.value = null;
  
  try {
    const details = await Backend.courseTeacherSessionGet(sessionId);
    sessionDetails.value = details;
    
    const response = await Backend.courseSessionAttendanceListGet(sessionId);
    console.log("Odpowiedź z API:", response);
    
    attendanceList.value = response;
  } catch (err: any) {
    console.error("Błąd przy pobieraniu szczegółów:", err);
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

async function refreshAttendanceList() {
  console.log("Ręczne odświeżanie listy obecności");
  isRefreshing.value = true;
  
  try {
    await fetchSessionDetails();
    console.log("Lista odświeżona pomyślnie");
  } finally {
    isRefreshing.value = false;
  }
}

onMounted(() => {
  fetchSessionDetails();
});
</script>

<style scoped>
</style>
