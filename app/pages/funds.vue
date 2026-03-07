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
          <template #item.aum="{ item }">
            {{ formatCurrency(Number(item.aum ?? 0)) }}
          </template>
          <template #item.total_units="{ item }">
            {{ formatThousand(Number(item.total_units ?? 0)) }}
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp();

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref<{ key: string; order: "desc" | "asc" }[]>([
  { key: "aum", order: "desc" },
]);

const { data: funds, pending: loading } = await $trpc.funds.list.useQuery(
  () => ({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "id",
    sort_order: sortBy.value[0]?.order ?? "desc",
  }),
);

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Fund", key: "code" },
  { title: "Name", key: "name" },
  { title: "Category", key: "fund_category_id" },
  { title: "AUM", key: "aum" },
  { title: "Total Units", key: "total_units" },
]);
</script>
