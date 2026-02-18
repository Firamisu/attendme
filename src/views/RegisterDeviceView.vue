<template>
  <div class="bg-white text-black min-h-screen px-4 py-8 max-w-lg mx-auto">

    
    <div class="text-center mb-10 space-y-4">
    

      <h1 class="
        text-4xl font-black uppercase tracking-tight
        border-b-4 border-black inline-block pb-2
      ">
        Rejestracja urządzenia
      </h1>

      <p class="text-lg font-medium leading-relaxed max-w-prose mx-auto">
        Rejestrujesz urządzenie, którego będziesz używać do sprawdzania obecności.<br>
        Uzupełnij poniższe dane i naciśnij przycisk <span class="font-black">"Zarejestruj"</span>.
      </p>
    </div>

    
    <form @submit.prevent="handleSubmit" class="space-y-7">

      
      <div class="space-y-2">
        <label class="block text-xl font-black uppercase tracking-wide">
          Nazwa urządzenia
        </label>
        <input
          v-model="form.deviceName"
          type="text"
          placeholder="Wprowadź nazwę urządzenia"
          required
          class="
            w-full p-4 border-4 border-black bg-white
            text-lg font-medium
            focus:outline-none focus:ring-4 focus:ring-black/30
            brutal-shadow-sm
          "
        />
      </div>

      
      <div class="space-y-2">
        <label class="block text-xl font-black uppercase tracking-wide">
          Twoje imię
        </label>
        <input
          v-model="form.studentName"
          type="text"
          placeholder="Wprowadź swoje imię"
          required
          class="
            w-full p-4 border-4 border-black bg-white
            text-lg font-medium
            focus:outline-none focus:ring-4 focus:ring-black/30
            brutal-shadow-sm
          "
        />
      </div>

      
      <div class="space-y-2">
        <label class="block text-xl font-black uppercase tracking-wide">
          Twoje nazwisko
        </label>
        <input
          v-model="form.studentSurname"
          type="text"
          placeholder="Wprowadź swoje nazwisko"
          required
          class="
            w-full p-4 border-4 border-black bg-white
            text-lg font-medium
            focus:outline-none focus:ring-4 focus:ring-black/30
            brutal-shadow-sm
          "
        />
      </div>

      
      <div class="space-y-2">
        <label class="block text-xl font-black uppercase tracking-wide">
          Twój numer albumu
        </label>
        <input
          v-model="form.albumIdNumber"
          type="number"
          placeholder="Wprowadź numer albumu"
          required
          pattern="[0-9]+"
          title="Tylko cyfry"
          class="
            w-full p-4 border-4 border-black bg-white
            text-lg font-medium
            focus:outline-none focus:ring-4 focus:ring-black/30
            brutal-shadow-sm
          "
        />
      </div>

      
      <button
        type="submit"
        :disabled="isSubmitting"
        class="
          w-full mt-4
          bg-green-700 hover:bg-green-800
          text-white font-black text-xl uppercase
          py-5 px-8
          border-4 border-black brutal-shadow
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {{ isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj' }}
      </button>
    </form>

    
    <div v-if="errorMessage" class="mt-6">
      <div class="
        bg-red-600 text-white font-black text-lg
        px-5 py-4 border-4 border-black brutal-shadow text-center
      ">
        {{ errorMessage }}
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import type { DeviceRegisterDTO } from '@/backend/AttendMeBackendClientBase'
import { useDeviceRegistration } from '@/composables/useDeviceManager'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

if (route.params.token == null) {
   router.push({ name: 'login' })
}

const token = route.params.token as string;

const form = ref<DeviceRegisterDTO>({
  deviceName: '',
  studentName: '',
  studentSurname: '',
})

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const { registerDevice } = useDeviceRegistration()

const handleSubmit = async () => {
  isSubmitting.value = true
  await registerDevice(token, form.value)
  isSubmitting.value = false
}

</script>

