import "./assets/base.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { AttendMeBackendClient } from "./backend/AttendMeBackendClient";
import { enableDateISO8601Serialization } from "./helpers/JsonHelpers";
import { createToastflow } from "vue-toastflow";

const backend = new AttendMeBackendClient(
  "https://attendme-backend.runasp.net",
);

backend.onUnauthorized = (url: string) => {
  console.warn(`Unauthorized access to ${url}, redirecting to login...`);
  router.push({ name: "login" });
};

enableDateISO8601Serialization();

const app = createApp(App);

app.use(createPinia());

app.use(router);


app.use(
  createToastflow({
    position: "top-right",
    duration: 5000,
    maxVisible: 5,
  }),
);


app.mount("#app");

export { backend as Backend };
