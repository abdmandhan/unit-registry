<template>
  <v-data-table :headers="headers" :items="transactions" density="compact">
    <template #item.fund.name="{ item }">
      {{ item.fund?.name }}
    </template>
    <template #item.transaction_type="{ item }">
      <v-chip
        density="compact"
        :color="
          item.transaction_type === 'SUBSCRIPTION'
            ? 'green'
            : item.transaction_type === 'REDEMPTION'
              ? 'red'
              : 'blue'
        "
      >
        {{ item.transaction_type }}
      </v-chip>
    </template>
    <template #item.amount="{ item }">
      {{ formatCurrency(Number(item.amount ?? 0)) }}
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const props = defineProps<{
  investorId: string;
}>();

const { data: transactions } = await $trpc.investor.transactions.useQuery(
  () => ({
    id: props.investorId,
  }),
);

const headers = ref([
  { title: "Fund", sortable: true, key: "fund.code" },
  { title: "Transaction Type", sortable: true, key: "transaction_type" },
  { title: "Transaction Date", sortable: true, key: "transaction_date" },
  { title: "Units", sortable: true, key: "units" },
  { title: "Amount", sortable: true, key: "amount" },
]);
</script>
