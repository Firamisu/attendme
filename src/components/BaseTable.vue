<template>
  <div class="table-container">
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.name">
              {{ header.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td v-for="(value, key) in headers" :key="String(key)">
              <p v-if="value.type == 'string' || value.type == 'number'">
                {{ item[key] }}
              </p>
              <p v-else-if="value.type == 'boolean'">
                {{ item[key] ? "Yes" : "No" }}
              </p>
              <p v-else-if="value.type == 'date'">
                {{ new Date(item[key] as string | number).toLocaleString() }}
              </p>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td
              :colspan="Object.keys(headers).length"
              style="text-align: center"
            >
              No data found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <div class="info">
        Showing {{ items.length }} of {{ totalCount }} results
      </div>

      <div class="controls">
        <button @click="changePage(pageNumber - 1)" :disabled="pageNumber <= 1">
          Previous
        </button>

        <span class="page-indicator"
          >Page {{ pageNumber }} of {{ totalPages }}</span
        >

        <button
          @click="changePage(pageNumber + 1)"
          :disabled="pageNumber >= totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: Array<{ [key: string]: string | number | boolean | Date }>;
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
