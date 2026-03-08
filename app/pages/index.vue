<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="flex justify-between">
        <h1 class="text-xl font-semi-bold">Welcome, {{ user?.username }}</h1>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-text> AUM </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card>
          <v-card-text>Investors </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card>
          <v-card-text> Funds </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-date-picker hide-header hide-title></v-date-picker>
      </v-col>

      <v-col cols="6">
        <v-card title="Top Funds by AUM">
          <v-card-text>
            <v-data-table-server
              :headers="headers"
              :items="data?.funds ?? []"
              :items-length="data?.total ?? 0"
              :loading="loading"
              v-model:page="page"
              v-model:items-per-page="pageSize"
              v-model:sort-by="sortBy"
            >
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { validate } from "~~/shared/types/dashboard/funds";
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

const { data, pending: loading } = await useFetch("/api/dashboard/funds", {
  query,
  watch: [query],
  immediate: true,
});
const { user } = useUserSession();

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Fund", key: "name" },
]);
</script>
