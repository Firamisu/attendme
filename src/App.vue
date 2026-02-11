<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import LoggedInLayout from "@/layouts/LoggedInLayout.vue";

const route = useRoute();

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case "LoggedInLayout":
      return LoggedInLayout;
    default:
      return "div";
  }
});
</script>

<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<style scoped></style>
