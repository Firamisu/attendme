<template>
  <div
    class="bg-white text-black min-h-screen flex flex-col items-center justify-center px-6 py-8"
  >
    <div
      class="border-8 border-black bg-white p-6 brutal-shadow mb-10 w-full max-w-xs aspect-square flex items-center justify-center"
    >
      <div
        class="w-full h-full bg-gray-200 flex items-center justify-center text-center font-black text-xl uppercase tracking-widest"
      >
        <qrcode-vue v-if="currentTicket"
          class="w-full h-full"
          :value="currentTicket"
          :size="500"
          level="H"
          render-as="svg"
        />
        <div v-else class="text-gray-500">
          Generowanie kodu QR...
        </div>
      </div>
    </div>

    <div class="text-center space-y-6 max-w-md">
      <h1
        class="text-3xl md:text-4xl font-black uppercase tracking-tight border-b-4 border-black inline-block pb-2"
      >
        Zarejestruj obecność
      </h1>

      <p class="text-xl font-medium leading-relaxed">
        Umieść telefon w polu widzenia skanera.
      </p>

      <p class="text-lg font-medium text-gray-700">
        W razie wątpliwości poproś osobę prowadzącą zajęcia o pomoc.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

import { attendanceTicketGenerator } from "@/composables/useAttendanceManager";

const  { currentTicket } = attendanceTicketGenerator();


</script>
