<template>
  <v-app>
    <v-main>
      {{ queryInput }}
      <v-data-table-server
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="investors?.items ?? []"
        :items-length="investors?.total ?? 0"
        :loading="loading"
        :search="search"
        item-value="first_name"
        @update:options="loadInvestors"
        density="compact"
      ></v-data-table-server>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const page = ref(1);
const pageSize = ref(20);

const queryInput = computed(() => ({
  page: page.value,
  page_size: pageSize.value,
}));

const { data: investors, pending: loading } =
  await $trpc.investors.useQuery(queryInput);

const loadInvestors = (e: any) => {
  console.log("load investor", e);
  page.value = e.page;
  pageSize.value = e.itemsPerPage;
};

const headers = ref([
  {
    title: "First Name",
    sortable: false,
    key: "first_name",
  },
  { title: "Last Name", key: "last_name" },
]);
const search = ref("");
</script>
