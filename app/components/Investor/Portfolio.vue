<template>
  <v-data-table :headers="headers" :items="portfolio" density="compact">
    <template #item.units_after="{ item }">
      {{ Number(item.units_after).toLocaleString() }}
    </template>
    <template #item.fund.latest_nav.nav_per_unit="{ item }">
      {{ formatCurrency(Number(item.fund?.latest_nav?.nav_per_unit ?? 0)) }}
    </template>
    <template #item.value="{ item }">
      {{ formatCurrency(Number(item.value ?? 0)) }}
    </template>
    <template #item.profit_and_loss="{ item }">
      {{ formatCurrency(Number(item.profit_and_loss ?? 0)) }}
    </template>
    <template #item.return_pct="{ item }">
      {{ item.return_pct.toFixed(2) }}%
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const props = defineProps<{
  investorId: string;
}>();

const { data: portfolio } = await $trpc.portfolio.useQuery(() => ({
  id: props.investorId,
}));

const headers = ref([
  { title: "Fund", sortable: true, key: "fund.code" },
  { title: "Units", sortable: true, key: "units_after" },
  { title: "Latest NAV", sortable: true, key: "fund.latest_nav.nav_per_unit" },
  { title: "Value", sortable: true, key: "value" },
  { title: "Profit and Loss", sortable: true, key: "profit_and_loss" },
  { title: "Return %", sortable: true, key: "return_pct" },
]);
</script>
