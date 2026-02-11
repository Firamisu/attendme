import { defineStore } from "pinia";
import type { User } from "@/backend/AttendMeBackendClientBase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
    isTeacher: (state) => state.user?.isTeacher === true,
    isStudent: (state) => state.user?.isStudent === true,
  },
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    clear() {
      this.user = null;
    },
  },
});
