<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Investors</span>
        <v-btn
          variant="text"
          color="secondary"
          size="small"
          @click="logout"
        >
          Logout
        </v-btn>
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
          show-select
          select-strategy="single"
          item-value="id"
          v-model="selectedInvestor"
        >
          <template #body.prepend>
            <tr>
              <td></td>
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
                  v-model="searchs.investor_type_id"
                />
              </td>
              <td>
                <v-text-field
                  :hide-details="true"
                  v-model="searchs.full_name"
                />
              </td>
              <td>
                <v-text-field
                  :hide-details="true"
                  v-model="searchs.sid"
                />
              </td>

              <td>
                <v-text-field
                  :hide-details="true"
                  v-model="searchs.email"
                  type="email"
                />
              </td>
              <td></td>
            </tr>
          </template>

          <template #item.investor_type_id="{ item }">
            <v-chip
              :color="item.investor_type_id === 'I' ? 'primary' : 'secondary'"
              density="compact"
            >
              {{
                item.investor_type_id === "I" ? "Individual" : "Corporate"
              }}
            </v-chip>
          </template>
          <template #item.full_name="{ item }">
            {{ item.full_name }}
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <v-container class="mt-4 pa-0">
      <InvestorDetail
        v-if="Number(selectedInvestor?.length) > 0"
        :investor-id="selectedInvestor?.[0] ?? ''"
      />
    </v-container>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "authenticated",
});

const { $trpc } = useNuxtApp();
const { clear } = useUserSession();

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref<{ key: string; order: "desc" | "asc" }[]>([
  { key: "aum", order: "desc" },
]);
const selectedInvestor = ref<string | null>(null);
const searchs = ref({
  full_name: "",
  sid: "",
  investor_type_id: "",
  email: "",
});

const queryInput = computed(() => ({
  page: page.value,
  page_size: pageSize.value,
  sort_by: sortBy.value[0]?.key ?? "id",
  sort_order: sortBy.value[0]?.order ?? "desc",
  searchs: Object.entries(searchs.value).map(([key, value]) => ({
    key,
    value,
  })),
}));

const { data: investors, pending: loading } =
  await $trpc.investor.list.useQuery(queryInput);

const headers = ref([
  { title: "Investor Type", sortable: true, key: "investor_type_id" },
  { title: "Full Name", sortable: true, key: "full_name" },
  { title: "SID", sortable: true, key: "sid" },
  { title: "Email", sortable: true, key: "email" },
  { title: "AUM", sortable: true, key: "aum" },
]);

async function logout() {
  await clear();
  await navigateTo("/login");
}
</script>

