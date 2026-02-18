<template>
  <div
    class="bg-white text-black min-h-screen px-4 py-10 flex flex-col items-center justify-center"
  >
    <div class="max-w-md w-full space-y-10 text-center">
      <div class="space-y-6">
        <h1
          class="text-4xl font-black uppercase tracking-tight border-b-4 border-black inline-block pb-2"
        >
          Urządzenie<br />zarejestrowane
        </h1>

        <p class="text-xl font-medium leading-relaxed">
          Przejdź do skanowania obecności<br />
          lub do pulpitu<br />
          <span class="text-lg text-gray-700">(wymagane logowanie)</span>
        </p>
      </div>

      <div class="space-y-5 w-full">
        <button
          class="w-full bg-green-700 hover:bg-green-800 text-white font-black text-xl uppercase py-6 px-8 border-4 border-black brutal-shadow transition-colors"
          @click="router.push({ name: 'student-scanner' })"
        >
          Skanuj obecność
        </button>

        <button
        @click="router.push({ name: 'student-panel' }) "
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black text-xl uppercase py-6 px-8 border-4 border-black brutal-shadow transition-colors"
        >
          Otwórz pulpit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

onBeforeMount(() => {
   const deviceAuthData = window.localStorage.getItem("attend-me:deviceAuthData");
   if (!deviceAuthData) {
     router.push({ name: "login" });
   }
});


</script>
