<template>
  <div class="bg-black text-white h-screen flex flex-col overflow-hidden">
    <div
      class="border-b-4 border-white/30 bg-black/80 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between shrink-0 z-10"
    >
      <button
        @click="router.back()"
        class="px-4 py-2 border-2 border-white/70 text-white font-bold uppercase tracking-wide text-sm hover:bg-white/10 active:bg-white/20 transition-colors"
      >
        Powrót
      </button>

      <select
        v-model="selectedConstraints"
        class="bg-black text-white border-2 border-white/60 px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-white max-w-1/2"
      >
        <option
          v-for="option in constraintOptions"
          :key="option.label"
          :value="option.constraints"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div
      class="flex-1 relative overflow-hidden lg:w-1/2 lg:my-5 lg:mx-auto lg:border-5 lg:border-[#slate]"
    >
      <qrcode-stream
        :constraints="selectedConstraints"
        :track="paintOutline"
        :formats="['qr_code']"
        @error="onError"
        @detect="onDetect"
        @camera-on="onCameraReady"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        v-if="error"
        class="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-sm border-t-4 border-white/30 p-4 text-center flex flex-col gap-2"
      >
        <p class="text-red-400 font-bold">Błąd: {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  QrcodeStream,
  type DetectedBarcode,
  type EmittedError,
} from "vue-qrcode-reader";
import { useRoute, useRouter } from "vue-router";
import { useAttendanceScanner } from "@/composables/useAttendanceManager";
import type { TokenResult } from "@/backend/AttendMeBackendClientBase";
import { errorToast } from "@/helpers/toasts";
import { unwrapError } from "@/helpers/error";

const router = useRouter();
const route = useRoute();

const { authorizeScannerDevice, processScannedTicket } = useAttendanceScanner();

onMounted(() => {
  try {
    const tokenData: TokenResult = JSON.parse(
      atob(route.params.tokenData as string),
    );
    authorizeScannerDevice(tokenData);
  } catch (err: unknown) {
    errorToast("Błąd", unwrapError(err));
  }
});

/*** detection handling ***/

const verificationInProgress = ref(false);

async function onDetect(detectedCodes: DetectedBarcode[]) {
  if (verificationInProgress.value) return;

  verificationInProgress.value = true;
  const promises: Promise<void>[] = [];
  for (const detectedCode of detectedCodes) {
    if (detectedCode.format !== "qr_code") continue;
    const ticketValue = detectedCode.rawValue;
    promises.push(processScannedTicket(ticketValue));
  }

  await Promise.all(promises);
  setTimeout(() => {
    verificationInProgress.value = false;
  }, 1000);
}

/*** select camera ***/
interface ConstraintOption {
  label: string;
  constraints: MediaTrackConstraints;
}

const selectedConstraints = ref<MediaTrackConstraints>({
  facingMode: "environment",
});
const defaultConstraintOptions: ConstraintOption[] = [
  { label: "rear camera", constraints: { facingMode: "environment" } },
  { label: "front camera", constraints: { facingMode: "user" } },
];
const constraintOptions = ref<ConstraintOption[]>(defaultConstraintOptions);

async function onCameraReady() {
  constraintOptions.value = [...defaultConstraintOptions];

  error.value = "";
}

/*** track functons ***/

function paintOutline(
  detectedCodes: DetectedBarcode[],
  ctx: CanvasRenderingContext2D,
) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.closePath();
    ctx.stroke();
  }
}

/*** error handling ***/

const error = ref<string>("");
function onError(err: EmittedError) {
  error.value = `[${err.name}]: `;

  if (err.name === "NotAllowedError") {
    error.value += "you need to grant camera access permission";
  } else if (err.name === "NotFoundError") {
    error.value += "no camera on this device";
  } else if (err.name === "NotSupportedError") {
    error.value += "secure context required (HTTPS, localhost)";
  } else if (err.name === "NotReadableError") {
    error.value += "is the camera already in use?";
  } else if (err.name === "OverconstrainedError") {
    error.value += "installed cameras are not suitable";
  } else if (err.name === "StreamApiNotSupportedError") {
    error.value += "Stream API is not supported in this browser";
  } else if (err.name === "InsecureContextError") {
    error.value +=
      "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
  } else {
    error.value += err.message;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
</style>
