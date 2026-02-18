<template>
  <div class="min-h-screen bg-white text-black flex flex-col">
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div
        class="w-full max-w-md border-4 border-black bg-white brutal-shadow p-8 space-y-8"
      >
        <div class="text-center space-y-4">
          <h1 class="text-4xl font-black uppercase tracking-tight">AttendMe</h1>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-xl font-black uppercase"> Login </label>
            <input
              v-model="credentials.login"
              type="text"
              placeholder="Podaj twój login"
              required
              autocomplete="username"
              class="w-full p-4 border-4 border-black bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-black/30 brutal-shadow-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xl font-black uppercase"> Hasło </label>
            <input
              v-model="credentials.password"
              type="password"
              placeholder="Podaj hasło"
              required
              autocomplete="current-password"
              class="w-full p-4 border-4 border-black bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-black/30 brutal-shadow-sm"
            />
          </div>

          <div
            v-if="error"
            class="bg-red-600 text-white font-black text-md uppercase px-1 py-1 border-4 border-black text-center"
          >
            {{ error }}
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white font-black text-xl uppercase py-5 border-4 border-black brutal-shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? "Logowanie..." : "Zaloguj" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLogin } from "@/composables/useLogin";

const router = useRouter();

const { credentials, loading, error, login } = useLogin();

const handleLogin = async () => {
  const result = await login();
  if (!result.success) return;
  router.push({ name: result.redirectTo });
};
</script>
