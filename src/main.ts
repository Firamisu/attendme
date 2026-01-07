import "./assets/base.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { AttendMeBackendClient } from "./backend/AttendMeBackendClient";

const backend = new AttendMeBackendClient(
  "https://attendme-backend.runasp.net",
);

backend.onUnauthorized = (url: string) => {
  console.warn(`Unauthorized access to ${url}, redirecting to login...`);
  router.push({ name: "login" });
};

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

export { backend as Backend };
