<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-data-table-server
          :headers="headers"
          :items="references?.items ?? []"
          :items-length="references?.total ?? 0"
          :loading="loading"
          v-model:page="page"
          v-model:items-per-page="pageSize"
          v-model:sort-by="sortBy"
        >
          <template #body.prepend>
            <tr>
              <td></td>
              <td>
                <v-autocomplete
                  density="compact"
                  :hide-details="true"
                  v-model="filters.reference_name"
                  :items="referenceList"
                  item-title="reference_name"
                  item-value="reference_name"
                />
              </td>
              <td>
                <v-text-field :hide-details="true" v-model="filters.name" />
              </td>
              <td>
                <v-text-field :hide-details="true" v-model="filters.code" />
              </td>
            </tr>
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
  { key: "id", order: "desc" },
]);

const filters = ref({
  reference_name: "",
  code: "",
  name: "",
});

const query = computed(() =>
  validate({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "id",
    sort_order: sortBy.value[0]?.order ?? "desc",
    filters: JSON.stringify(
      Object.entries(filters.value).map(([key, value]) => ({ key, value })),
    ),
  }),
);

const { data: references, pending: loading } = await useFetch(
  "/api/references",
  {
    query,
    watch: [query],
    immediate: true,
  },
);

const { data: referenceList, pending: referenceListLoading } = await useFetch(
  "/api/references/list",
  {
    watch: [query],
    immediate: true,
  },
);

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Reference Name", key: "reference_name", maxWidth: 200 },
  { title: "Name", key: "name" },
  { title: "Code", key: "code" },
]);
</script>
