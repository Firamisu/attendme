import LoginView from "@/views/LoginView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "student-panel" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/student",
      name: "student-panel",
      component: () => import("@/views/StudentPanelView.vue"),
    },
  ],
});

export default router;
