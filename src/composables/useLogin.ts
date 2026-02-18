// composables/useLogin.ts
import { ref } from "vue";
import { Backend } from "@/main";
import { useAuthStore } from "@/stores/auth";
import { unwrapError } from "@/helpers/error";

import type { LoginForm } from "@/types/auth";
import type { User } from "@/backend/AttendMeBackendClientBase";

export function useLogin() {
  const authStore = useAuthStore();

  const credentials = ref<LoginForm>({ login: "", password: "" });
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function login(): Promise<{ success: boolean; redirectTo?: string }> {
    loading.value = true;
    error.value = null;

    try {
      const response = await Backend.userLogin(
        credentials.value.login,
        credentials.value.password,
      );

      if (!response.token) {
        throw new Error("No token received");
      }

      const user = await Backend.userGet(undefined);
      authStore.setUser(user);

      return { success: true, redirectTo: getRedirectTarget(user) };
    } catch (err: unknown) {
      authStore.clear();
      error.value = unwrapError(err);
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  return {
    credentials,
    loading,
    error,
    login,
  };
}

function getRedirectTarget(user: User): string {
  if (user.isTeacher) {
    return "teacher-panel";
  } else if (user.isStudent) {
    return "student-panel";
  } else {
    throw new Error("System nie obsluguje tego typu użytkownika");
  }
}
