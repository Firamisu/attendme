import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Backend } from "@/main";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "login" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/teacher",
      name: "teacher-panel",
      meta: {
        layout: "LoggedInLayout",
      },
      component: () => import("@/views/TeacherPanelView.vue"),
    },
    {
      path: "/student",
      name: "student-panel",
      meta: {
        layout: "LoggedInLayout",
      },
      component: () => import("@/views/StudentPanelView.vue"),
    },
    {
      path: "/teacher/session/:id",
      name: "teacher-session-details",
      meta: {
        layout: "LoggedInLayout",
      },
      component: () => import("@/views/TeacherSessionDetailsView.vue"),
    },
    {
      path: "/student/session/:groupId/:id",
      name: "student-session-details",
      meta: {
        layout: "LoggedInLayout",
      },
      component: () => import("@/views/StudentSessionDetailsView.vue"),
    },
    {
      path: "/register-device/:token",
      name: "register-device",
      component: () => import("@/views/RegisterDeviceView.vue"),
    },
    {
      path: "/register-device-success",
      name: "register-device-success",
      component: () => import("@/views/RegisterDeviceSuccess.vue"),
    },
    {
      path: "/student/scanner",
      name: "student-scanner",
      component: () => import("@/views/StudentScannerView.vue"),
    },
    {
      path: "/teacher/scanner/:tokenData",
      name: "teacher-scanner",
      component: () => import("@/views/TeacherScannerView.vue"),
    }

  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.user && Backend.userTokenResult?.token) {
    try {
      const user = await Backend.userGet(undefined);
      authStore.setUser(user);
    } catch {
      authStore.clear();
      Backend.userLogout();
    }
  }

  if (to.name === "login") {
    if (authStore.isTeacher) return { name: "teacher-panel" };
    if (authStore.isStudent) return { name: "student-panel" };
  }

  if (to.path === "/") {
    if (authStore.isTeacher) return { name: "teacher-panel" };
    if (authStore.isStudent) return { name: "student-panel" };
    return { name: "login" };
  }

  return true;
});

export default router;
