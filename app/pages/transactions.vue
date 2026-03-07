<template>
  <v-container>
    <v-card>
      <v-card-text class="overflow-x-auto mt-1">
        <v-data-table-server
          :headers="headers"
          :items="transactions?.transactions ?? []"
          :items-length="transactions?.total ?? 0"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="pageSize"
          v-model:sort-by="sortBy"
        >
          <template #item.transaction_date="{ item }">
            {{ formatDate(item.transaction_date) }}
          </template>
          <template #item.nav_date="{ item }">
            {{ formatDate(item.nav_date) }}
          </template>
          <template #item.transaction_type="{ item }">
            <v-chip
              :color="
                item.transaction_type === 'SUBSCRIPTION' ||
                item.transaction_type == 'SWITCHING_IN'
                  ? 'green'
                  : 'red'
              "
              density="compact"
            >
              {{ item.transaction_type }}
            </v-chip>
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
  { key: "transaction_date", order: "desc" },
]);

const { data: transactions, pending: loading } =
  await $trpc.transactions.list.useQuery(() => ({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "id",
    sort_order: sortBy.value[0]?.order ?? "desc",
  }));

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Transaction Type", key: "transaction_type" },
  { title: "Investor", key: "investor.full_name" },
  { title: "Fund", key: "fund.code" },
  { title: "Agent", key: "agent.name" },
  { title: "Transaction Date", key: "transaction_date" },
  { title: "Nav Date", key: "nav_date" },
  { title: "Nav Per Unit", key: "nav_per_unit" },
  { title: "Units", key: "units" },
  { title: "Amount", key: "amount" },
  //   { title: "Reference No", key: "reference_no" },
  //   { title: "Net Amount", key: "net_amount" },
  //   { title: "Fee", key: "fee" },
  //   { title: "Remarks", key: "remarks" },
  //   { title: "Created At", key: "created_at" },
]);
</script>
