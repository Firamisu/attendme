<template>
  <div class="bg-white text-black px-4 py-6 max-w-4xl mx-auto">
    <div class="space-y-5">
      <article
        v-for="user in userList"
        :key="user.studentId"
        class="border-4 border-black bg-white brutal-shadow p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex-1 space-y-2">
          <div class="flex items-baseline gap-3">
            <span class="font-black text-2xl">
              <BaseSurname v-if="user.surname" :surname="user.surname"/>
            </span>
            <div>
              <div class="font-bold text-lg leading-tight">
                {{ user.name }}
              </div>
              <div class="text-gray-700 text-sm">{{ user.loginName }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-600">Urządzenie:</span>
            <span
              :class="[
                'font-black px-3 py-1 text-sm uppercase tracking-wide',
                user.deviceName == null
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-black',
              ]"
            >
              {{ user.deviceName || "—" }}
            </span>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row gap-3 md:gap-4 items-start md:items-center"
        >
          <button
            v-if="user.deviceName != null"
            class="bg-red-700 hover:bg-red-800 text-white font-black uppercase px-5 py-3 border-4 border-black brutal-shadow-sm transition-colors w-full sm:w-auto"
            @click="resetDevice(user.userId)"
          >
            Resetuj
          </button>

          <button
            class="bg-black hover:bg-gray-800 text-white font-black uppercase px-6 py-3 border-4 border-black brutal-shadow-sm transition-colors w-full sm:w-auto"
            @click="copyLink(user.userId)"
          >
            Skopiuj link
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserDevicesList } from '@/composables/useDeviceManager';
import { onMounted } from 'vue';
import BaseSurname from './BaseSurname.vue';

const props = defineProps<{
  userIds: number[];
}>();

const { fetchUsers, copyLink, resetDevice, userList } = useUserDevicesList();

onMounted(  () => {
  fetchUsers(props.userIds);
});

</script>

