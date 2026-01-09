<template>
  <main>
    <h1>Login form</h1>

    <form @submit.prevent="login()">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
      <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { Backend } from "@/main";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | null>(null);
const router = useRouter();

async function login() {
  await Backend.userLogin(username.value, password.value)
    .then((response) => {
      if (!response.token) {
        throw new Error("No token received");
      }

      router.push({ name: "student-panel" });

      errorMessage.value = null;
    })
    .catch((error) => {
      errorMessage.value = "Login failed: " + error.message;
    });
}
</script>
