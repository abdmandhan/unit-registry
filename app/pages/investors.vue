<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Investors</span>
      </v-card-title>
      <v-card-text>
        <v-data-table-server
          v-model:items-per-page="pageSize"
          :headers="headers"
          :items="investors?.items ?? []"
          :items-length="investors?.total ?? 0"
          :loading="loading"
          v-model:page="page"
          v-model:sort-by="sortBy"
          item-value="id"
          v-model="selectedInvestor"
        >
          <template #body.prepend>
            <tr>
              <td>
                <v-select
                  :hide-details="true"
                  item-title="text"
                  item-value="value"
                  :items="[
                    { text: 'All', value: '' },
                    { text: 'Individual', value: 'I' },
                    { text: 'Corporate', value: 'C' },
                  ]"
                  v-model="searches.investor_type_id"
                />
              </td>
              <td>
                <v-text-field
                  :hide-details="true"
                  v-model="searches.full_name"
                />
              </td>
              <td>
                <v-text-field :hide-details="true" v-model="searches.sid" />
              </td>

              <td>
                <v-text-field
                  :hide-details="true"
                  v-model="searches.email"
                  type="email"
                />
              </td>
              <td></td>
              <td></td>
            </tr>
          </template>

          <template #item.investor_type_id="{ item }">
            <v-chip
              :color="item.investor_type_id === 'I' ? 'primary' : 'secondary'"
              density="compact"
            >
              {{ item.investor_type_id === "I" ? "Individual" : "Corporate" }}
            </v-chip>
          </template>
          <template #item.full_name="{ item }">
            {{ item.full_name }}
          </template>
          <template #item.actions>
            <v-btn flat icon size="small">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <!-- <v-container class="mt-4 pa-0">
      <InvestorView
        v-if="Number(selectedInvestor?.length) > 0"
        :investor-id="selectedInvestor?.[0] ?? ''"
      />
    </v-container> -->
  </v-container>
</template>

<script lang="ts" setup>
import { validate } from "~~/shared/types/pagination";
definePageMeta({
  middleware: "authenticated",
});

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref<{ key: string; order: "desc" | "asc" }[]>([
  { key: "id", order: "desc" },
]);
const selectedInvestor = ref<string | null>(null);
const searches = ref({
  full_name: "",
  sid: "",
  investor_type_id: "",
  email: "",
});

const query = computed(() =>
  validate({
    page: page.value,
    page_size: pageSize.value,
    sort_by: sortBy.value[0]?.key ?? "id",
    sort_order: sortBy.value[0]?.order ?? "desc",
    filters: JSON.stringify(
      Object.entries(searches.value).map(([key, value]) => ({
        key,
        value,
      })),
    ),
  }),
);

const { data: investors, pending: loading } = await useFetch("/api/investors", {
  query,
  watch: [query],
  immediate: true,
});

const headers = ref([
  { title: "Investor Type", sortable: true, key: "investor_type_id" },
  { title: "Full Name", sortable: true, key: "full_name" },
  { title: "SID", sortable: true, key: "sid" },
  { title: "Email", sortable: true, key: "email" },
  { title: "AUM", sortable: true, key: "aum" },
  { title: "Actions", sortable: false, key: "actions" },
]);
</script>
