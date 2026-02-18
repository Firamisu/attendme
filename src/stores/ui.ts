import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const isLoading = ref(false);
  const loadingMessage = ref("");

  function showLoading(msg = "Ładowanie...") {
    loadingMessage.value = msg;
    isLoading.value = true;
  }

  function hideLoading() {
    isLoading.value = false;
    loadingMessage.value = "";
  }

  return { isLoading, loadingMessage, showLoading, hideLoading };
});
