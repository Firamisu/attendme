<template>
  <BaseModal
    v-if="showRegLinksModal"
    v-model="showRegLinksModal"
    title="Linki do rejestracji urządzenia"
    size="xl"
  >
    <template #content>
      <DeviceRegistrationLinks :user-ids="userIds" />
    </template>

    <template #footer>
      <button
        @click="showRegLinksModal = false"
        class="bg-black text-white font-black uppercase px-5 py-3 text-xl border-4 border-black brutal-shadow hover:bg-gray-800 transition-colors"
      >
        Zamknij
      </button>
    </template>
  </BaseModal>

  <BaseModal
    v-if="showScannerRedirectModal"
    v-model="showScannerRedirectModal"
    title="Skaner obecności"
    size="xl"
  >
    <template #content>
      <div class="space-y-8 text-black bg-white">
        <div class="space-y-2 text-lg leading-relaxed font-medium">
          <p>Do rejestracji obecności</p>
          <p>Potrzebne jest urządzenie z kamerą (telefon / tablet).</p>
          <p>Zeskanuj poniższy kod QR lub otwórz link (przycisk poniżej).</p>
          <p class="font-bold">
            Umieść ekran telefonu z tym kodem w polu widzenia skanera
            prowadzącego.
          </p>
        </div>

        <div
          class="border-6 border-black bg-white p-5 md:p-8 brutal-shadow w-full max-w-md mx-auto aspect-square flex items-center justify-center overflow-hidden"
        >
          <qrcode-vue
            :value="scannerUrl"
            :size="380"
            level="H"
            render-as="svg"
            class="w-full h-full"
          />
        </div>

        <button
          @click="copyToClipboard"
          :disabled="!scannerUrl"
          class="w-full bg-black hover:bg-gray-900 text-white font-black uppercase text-xl py-5 px-8 border-4 border-black brutal-shadow disabled:opacity-80 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          Kopiuj do schowka
        </button>

        <p v-if="scannerUrl"  class="w-full wrap-break-word text-sm bg-slate-400 border border-slate-800">{{ scannerUrl }}</p>

        <p class="text-center text-sm text-gray-700 font-medium pt-4">
          W razie problemów poproś prowadzącego o pomoc.
        </p>
      </div>
    </template>
  </BaseModal>

  <div class="bg-white text-black px-4 py-6 max-w-4xl mx-auto">
    <div class="mb-8 space-y-4">
      <h1
        class="text-3xl font-black uppercase tracking-tight border-b-4 border-black inline-block pb-1"
      >
        {{ sessionDetails?.courseName }}
      </h1>

      <div class="flex flex-wrap gap-3">
        <button
          @click="router.back()"
          class="bg-gray-900 text-white font-black uppercase px-6 py-3 border-4 border-black brutal-shadow hover:bg-gray-800 transition-colors"
        >
          Wstecz
        </button>

        <button
          @click="getTokenAndOpenModal()"
          class="bg-blue-600 text-white font-black uppercase px-6 py-3 border-4 border-black brutal-shadow hover:bg-blue-700 transition-colors"
        >
          Skaner obecności
        </button>

        <button
          @click="showRegLinks"
          class="bg-gray-700 text-white font-black uppercase px-6 py-3 border-4 border-black brutal-shadow hover:bg-gray-800 transition-colors"
        >
          Rejestracja urządzenia
        </button>
      </div>

      <div class="space-y-1 text-lg font-medium mt-4">
        <div v-if="sessionDetails?.dateStart">
          Data:
          <span class="font-black">{{
            sessionDetails.dateStart.toLocaleString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          }}</span>
        </div>
        <div v-if="sessionDetails?.dateStart && sessionDetails.dateEnd">
          Godziny:
          <span class="font-black">
            {{ getTimeString(sessionDetails.dateStart) }} -
            {{ getTimeString(sessionDetails.dateEnd) }}
          </span>
        </div>
        <div v-if="sessionDetails?.locationName">
          Sala:
          <span class="font-black">{{ sessionDetails.locationName }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-5">
      <div
        v-for="student in attendanceList"
        :key="student.attenderUserId"
        class="border-4 border-black bg-white brutal-shadow p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-start gap-4 flex-1">
          <div class="font-black text-3xl w-10 text-center">
            <BaseSurname
              v-if="student.userSurname"
              :surname="student.userSurname"
            />
          </div>
          <div>
            <div class="font-bold text-xl leading-tight">
              {{ student.userName }}
            </div>
            <div class="text-gray-700 font-medium">
              {{ student.studentAlbumIdNumber }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            :class="[
              'inline-block px-5 py-2 font-black uppercase text-white text-sm tracking-wide border-2 border-black',
              student.wasUserPresent ? 'bg-green-600' : 'bg-red-600',
            ]"
          >
            {{ student.wasUserPresent ? "Obecny" : "Nieobecny" }}
          </span>
        </div>

        <button
          @click="
            toggleAttendance(
              student.courseSessionId,
              student.attenderUserId,
              !student.wasUserPresent,
            )
          "
          :class="[
            'font-black uppercase px-6 py-3 border-4 border-black brutal-shadow-sm transition-colors w-full sm:w-auto mt-3 sm:mt-0',
            student.wasUserPresent
              ? 'bg-gray-800 text-white hover:bg-gray-800'
              : 'bg-gray-300 text-black hover:bg-gray-400',
          ]"
        >
          {{ student.wasUserPresent ? "Odznacz" : "Zaznacz" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseModal from "@/components/BaseModal.vue";
import BaseSurname from "@/components/BaseSurname.vue";
import QrcodeVue from "qrcode.vue";
import DeviceRegistrationLinks from "@/components/DeviceRegistrationLinks.vue";
import {
  useAttendanceManager,
  useAttendanceScanner,
} from "@/composables/useAttendanceManager";
import { getTimeString } from "@/helpers/time";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { successToast } from "@/helpers/toasts";

const route = useRoute();
const router = useRouter();

const sessionId = Number(route.params.id);

if (isNaN(sessionId)) {
  router.push({ name: "teacher-panel" });
}

const showRegLinksModal = ref(false);
const userIds = ref<number[]>([]);
const { sessionDetails, attendanceList, toggleAttendance } =
  useAttendanceManager(sessionId);

const { generateScannerToken } = useAttendanceScanner();

const showScannerRedirectModal = ref(false);
const scannerUrl = ref<string>();

async function getTokenAndOpenModal() {
  const tokenRes = await generateScannerToken(sessionId);
  if (tokenRes == null) return;

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  scannerUrl.value = `${baseUrl}/teacher/scanner/${btoa(JSON.stringify(tokenRes))}`;


  showScannerRedirectModal.value = true
}

async function copyToClipboard() {
  if (!scannerUrl.value) return;
  await navigator.clipboard.writeText(scannerUrl.value).catch(() => {
    /*ignore error*/
  });

  successToast("Skopiowano do schowka", "Link do skanera został skopiowany do schowka")
}

function showRegLinks() {
  showRegLinksModal.value = true;
  for (const student of attendanceList.value) {
    if (!student.attenderUserId) continue;
    userIds.value.push(student.attenderUserId);
  }
}
</script>
