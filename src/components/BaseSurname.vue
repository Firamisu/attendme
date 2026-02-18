<template>
    <span :title="surname">{{ getFirstLetter(surname) }}</span>
</template>

<script setup lang="ts">
defineProps<{
  surname: string;
}>();

function getFirstLetter(s: string) {
  if (s.length === 0) return '';
  return s.charAt(0).toUpperCase();
}
</script>