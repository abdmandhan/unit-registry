<template>
  <v-data-table :headers="headers" :items="transactions" density="compact">
    <template #item.fund.name="{ item }">
      {{ item.fund?.name }}
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const props = defineProps<{
  investorId: string;
}>();

const { data: transactions } = await $trpc.transactions.useQuery(() => ({
  id: props.investorId,
}));

const headers = ref([
  { title: "Fund", sortable: true, key: "fund.code" },
  { title: "Transaction Type", sortable: true, key: "transaction_type" },
  { title: "Transaction Date", sortable: true, key: "transaction_date" },
  { title: "Units", sortable: true, key: "units" },
  { title: "Amount", sortable: true, key: "amount" },
]);
</script>
