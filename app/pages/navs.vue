<template>
  <v-container>
    <v-card title="Fund NAV">
      <v-card-text>
        <v-data-table-server
          :headers="headers"
          :items="navs?.items ?? []"
          :items-length="navs?.total ?? 0"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="pageSize"
          v-model:sort-by="sortBy"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
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
  { key: "date", order: "desc" },
]);

const query = computed(() =>
  validate({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "date",
    sort_order: sortBy.value[0]?.order ?? "desc",
  }),
);

const { data: navs, pending: loading } = await useFetch("/api/navs", {
  query,
  watch: [query],
  immediate: true,
});

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Fund", key: "fund.code" },
  { title: "Date", key: "date" },
  { title: "Nav", key: "nav" },
  { title: "Nav Per Unit", key: "nav_per_unit" },
  { title: "Outstanding Unit", key: "outstanding_unit" },
]);
</script>
