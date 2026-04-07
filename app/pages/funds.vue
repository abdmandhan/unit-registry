<template>
  <v-container>
    <v-card>
      <v-card-text class="overflow-x-auto mt-1">
        <v-data-table-server
          :headers="headers"
          :items="funds?.funds ?? []"
          :items-length="funds?.total ?? 0"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="pageSize"
          v-model:sort-by="sortBy"
        >
          <template #item.nav="{ item }">
            {{ formatCurrency(Number(item.nav ?? 0)) }}
          </template>
          <template #item.outstanding_unit="{ item }">
            {{ formatThousand(Number(item.outstanding_unit ?? 0)) }}
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
  { key: "nav", order: "desc" },
]);

const query = computed(() =>
  validate({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "nav",
    sort_order: sortBy.value[0]?.order ?? "desc",
  }),
);

const { data: funds, pending: loading } = await useFetch("/api/funds", {
  query,
  watch: [query],
  immediate: true,
});

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Fund", key: "code" },
  { title: "Name", key: "name" },
  { title: "Category", key: "fund_category_id" },
  { title: "AUM", key: "nav" },
  { title: "Total Units", key: "outstanding_unit" },
]);
</script>
