<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title> Investors </v-card-title>
          <v-card-text>
            <v-data-table-server
              v-model:items-per-page="pageSize"
              :headers="headers"
              :items="investors?.items ?? []"
              :items-length="investors?.total ?? 0"
              :loading="loading"
              v-model:page="page"
              density="compact"
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
                      density="compact"
                      :hide-details="true"
                      item-title="text"
                      item-value="value"
                      :items="[
                        { text: 'All', value: '' },
                        { text: 'Individual', value: 'I' },
                        { text: 'Corporate', value: 'C' },
                      ]"
                      v-model="searchs.investor_type_id"
                    >
                    </v-select>
                  </td>
                  <td>
                    <v-text-field
                      density="compact"
                      :hide-details="true"
                      v-model="searchs.name"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      density="compact"
                      :hide-details="true"
                      v-model="searchs.sid"
                    ></v-text-field>
                  </td>

                  <td>
                    <v-text-field
                      density="compact"
                      :hide-details="true"
                      v-model="searchs.email"
                      type="email"
                    />
                  </td>
                  <td></td>
                </tr>
              </template>

              <template #item.first_name="{ item }">
                {{ item.first_name }}
              </template>
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container>
        <!-- selected investor -->
        <InvestorDetail
          v-if="Number(selectedInvestor?.length) > 0"
          :investor-id="selectedInvestor?.[0] ?? ''"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref<{ key: string; order: "desc" | "asc" }[]>([
  { key: "aum", order: "desc" },
]);
const selectedInvestor = ref<string | null>(null);
const searchs = ref({
  name: "",
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
  await $trpc.investors.useQuery(queryInput);

const headers = ref([
  { title: "Investor Type", sortable: true, key: "investor_type_id" },
  { title: "Full Name", sortable: true, key: "first_name" },
  { title: "SID", sortable: true, key: "sid" },
  { title: "Email", sortable: true, key: "email" },
  { title: "AUM", sortable: true, key: "aum" },
]);
</script>
