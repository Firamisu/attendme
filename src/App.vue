<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import LoggedInLayout from "@/layouts/LoggedInLayout.vue";
import { useUiStore } from "./stores/ui";
import BaseLoader from "./components/BaseLoader.vue";
import { ToastContainer } from "vue-toastflow";


const route = useRoute();

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case "LoggedInLayout":
      return LoggedInLayout;
    default:
      return "div";
  }
});

const uiStore = useUiStore();
</script>

<template>
  <ToastContainer />
  <component :is="layoutComponent">
    <RouterView />
    <BaseLoader
      v-if="uiStore.isLoading"
      :loadingMessage="uiStore.loadingMessage"
    />
  </component>
</template>
