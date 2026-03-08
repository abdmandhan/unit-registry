<template>
  <v-container>
    <v-card>
      <v-card-title>Agents</v-card-title>
      <v-card-text>
        <v-data-table-server
          :headers="headers"
          :items="agents?.items ?? []"
          :items-length="agents?.total ?? 0"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="pageSize"
          v-model:sort-by="sortBy"
        >
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { validate } from "~~/shared/types/pagination";

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref<{ key: string; order: "desc" | "asc" }[]>([
  { key: "id", order: "desc" },
]);

const query = computed(() =>
  validate({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "id",
    sort_order: sortBy.value[0]?.order ?? "desc",
  }),
);

const { data: agents, pending: loading } = await useFetch("/api/agents", {
  query,
  watch: [query],
  immediate: true,
});

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Phone Number", key: "phone_number" },
  { title: "Agent Level", key: "agent_level.name" },
]);
</script>
