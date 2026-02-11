<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4"
  >
    <h1 class="text-3xl font-black mb-8 tracking-tighter text-black">
      ATTEND<span class="text-blue-600">ME</span>
    </h1>

    <div class="w-full max-w-sm bg-white border-2 border-black p-8 rounded-lg">
      <h2 class="text-xl font-bold mb-6">Login</h2>

      <form @submit.prevent="login()" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-bold uppercase mb-1"
            >Username
          </label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none rounded-md"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-bold uppercase mb-1"
            >Password
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full border-2 border-black p-2 focus:bg-yellow-50 outline-none rounded-md"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-black text-white py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
        >
          Login
        </button>

        <div
          v-if="errorMessage"
          class="mt-4 p-2 border border-red-600 text-red-600 text-sm font-bold rounded-md"
        >
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Backend } from "@/main";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const username = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | null>(null);
const router = useRouter();
const authStore = useAuthStore();

async function login() {
  console.log("Próba logowania...");
  
  await Backend.userLogin(username.value, password.value)
    .then(async (response) => {
      console.log("Odpowiedź z logowania:", response);
      
      if (!response.token) {
        throw new Error("No token received");
      }

      console.log("Token otrzymany:", response.token);
      
      // Pobierz dane użytkownika aby sprawdzić rolę
      const user = await Backend.userGet(undefined);
      console.log("Dane użytkownika:", user);
      
      authStore.setUser(user);

      // Przekieruj w zależności od roli
      if (user.isTeacher) {
        console.log("Użytkownik jest wykładowcą");
        router.push({ name: "teacher-panel" });
      } else if (user.isStudent) {
        console.log("Użytkownik jest studentem");
        router.push({ name: "student-panel" });
      } else {
        throw new Error("User has no valid role");
      }

      errorMessage.value = null;
    })
    .catch((error) => {
      console.error("Błąd logowania:", error);
      authStore.clear();
      errorMessage.value = "Login failed: " + error.message;
    });
}
</script>
