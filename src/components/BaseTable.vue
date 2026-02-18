<template>
  <div class="w-full bg-white text-black">
    <div class="overflow-x-auto border-2 border-black">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr
            class="border-b-2 border-black uppercase text-sm font-black tracking-tight"
          >
            <th
              v-for="header in headers"
              :key="header.name"
              class="p-3 border-r border-black last:border-r-0"
            >
              {{ header.name }}
            </th>
            <th v-if="actions.length > 0" class="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            class="border-b border-black last:border-b-0"
          >
            <td
              v-for="(value, key) in headers"
              :key="String(key)"
              class="p-3 border-r border-black last:border-r-0"
            >
              <span v-if="value.type == 'string' || value.type == 'number'">
                {{ item[key] }}
              </span>
              <span v-else-if="value.type == 'boolean'" class="font-bold">
                {{ item[key] ? "YES" : "NO" }}
              </span>
              <span v-else-if="value.type == 'date'">
                {{ new Date(item[key] as string | number).toLocaleString() }}
              </span>
            </td>

            <td
              v-if="actions.length != 0 && items.length > 0"
              class="p-3 space-x-2"
            >
              <button
                v-for="act in actions"
                :key="act.name"
                @click="act.action(item)"
                class="border border-black px-2 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white transition-none"
              >
                {{ act.name }}
              </button>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td
              :colspan="
                Object.keys(headers).length + (actions.length > 0 ? 1 : 0)
              "
              class="p-10 text-center uppercase font-bold"
            >
              No data found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-4 flex flex-col sm:flex-row justify-between items-center border-2 border-black p-4 gap-4"
    >
      <div class="font-bold uppercase text-sm">
        Showing {{ items.length }} / {{ totalCount }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="changePage(pageNumber - 1)"
          :disabled="pageNumber <= 1"
          class="border-2 border-black px-4 py-1 font-bold uppercase disabled:opacity-20 hover:bg-black hover:text-white"
        >
          Prev
        </button>

        <span class="px-4 font-bold">
          {{ pageNumber }} / {{ totalPages }}
        </span>

        <button
          @click="changePage(pageNumber + 1)"
          :disabled="pageNumber >= totalPages"
          class="border-2 border-black px-4 py-1 font-bold uppercase disabled:opacity-20 hover:bg-black hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from "@/types/types";

interface Props {
  items: Array<Item>;
  headers: {
    [key: string]: {
      name: string;
      type: "string" | "number" | "boolean" | "date";
    };
  };
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  actions: Array<{
    name: string;
    action: (el: Item) => void;
  }>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "changePage", page: number): void;
}>();

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit("changePage", newPage);
  }
};
</script>

<style scoped>
.table-container {
  font-family: sans-serif;
  width: 100%;
}

.table-responsive {
  overflow-x: auto;
  border: 1px solid #ddd;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 10px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
}

button:disabled {
  background: #eee;
  cursor: not-allowed;
  color: #888;
}

.page-indicator {
  font-size: 0.9rem;
}
</style>
