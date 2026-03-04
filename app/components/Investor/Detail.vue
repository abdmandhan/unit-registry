<template>
  <v-form>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        {{ investorId }}
        <v-btn color="primary" @click="submit">SUBMIT</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row density="compact">
          <v-col cols="12" md="4">
            <v-text-field label="First Name" v-model="form.first_name" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="Middle Name" v-model="form.middle_name" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="Last Name" v-model="form.last_name" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
  <v-sheet elevation="2">
    <v-tabs v-model="tab" color="primary">
      <v-tab value="portfolio">Portfolio</v-tab>
      <v-tab value="transactions">Transactions</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="portfolio">
        <v-sheet class="pa-5">
          <InvestorPortfolio :investor-id="investorId" />
        </v-sheet>
      </v-tabs-window-item>
      <v-tabs-window-item value="transactions">
        <v-sheet class="pa-5">
          <InvestorTransactions :investor-id="investorId" />
        </v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();
const tab = ref("portfolio");

const props = defineProps<{
  investorId: string;
}>();

const form = reactive({
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  risk_level_id: 0,
  risk_point: 0,
  sid: "",
  investor_type_id: "",
  version: 1,
});

const { data: investor } = await $trpc.get.useQuery(() => ({
  id: props.investorId,
}));

if (!investor) {
  throw new Error("Investor not found");
}

watch(
  investor,
  (newVal) => {
    console.log("investor", newVal);
    form.first_name = newVal?.first_name ?? "";
    form.middle_name = newVal?.middle_name ?? "";
    form.last_name = newVal?.last_name ?? "";
    form.email = newVal?.email ?? "";
    form.phone_number = newVal?.phone_number ?? "";
    form.risk_level_id = newVal?.risk_level_id ?? 0;
    form.risk_point = newVal?.risk_point ?? 0;
    form.sid = newVal?.sid ?? "";
    form.investor_type_id = newVal?.investor_type_id ?? "";
    form.version = newVal?.version ?? 1;
  },
  { immediate: true, deep: true },
);

const submit = () => {
  console.log("submit");
};
</script>
