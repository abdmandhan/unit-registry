<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="flex justify-between">
        <div>Welcome back, {{ user?.username }}</div>
        <v-dialog contained max-width="382">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="primary">
              <div class="flex gap-2">
                <div
                  v-for="item in selectedDate"
                  :key="item.toISOString()"
                  v-if="selectedDate.length > 0"
                >
                  {{ item.toLocaleDateString() }}
                </div>
                <div class="flex gap-2 items-center" v-else>
                  <v-icon>mdi-calendar</v-icon>
                  <span>Select Date</span>
                </div>
              </div>
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-text>
                <v-date-picker
                  v-model="selectedDate"
                  multiple="range"
                  hide-header
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Close Dialog" @click="isActive.value = false" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title> Asset Under Management </v-card-title>
          <v-card-text class="flex flex-col items-start gap-4 mt-2">
            <!-- <v-icon>mdi-cash-multiple</v-icon> -->
            <span class="font-bold text-3xl text-right">
              {{ formatCurrency(aum?.aum ?? 0) }}
            </span>

            <div class="flex gap-2 items-center">
              <v-chip
                :color="
                  Number(aum?.aumDiffPercentage ?? 0) > 0 ? 'success' : 'error'
                "
                size="small"
              >
                <v-icon>
                  {{
                    Number(aum?.aumDiffPercentage ?? 0) > 0
                      ? "mdi-arrow-up"
                      : "mdi-arrow-down"
                  }}
                </v-icon>
                <span>{{ aum?.aumDiffPercentage.toFixed(2) }}%</span>
              </v-chip>

              <span class="text-sm text-gray-500">
                Compared from last month
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>AUM Trend</v-card-title>
          <v-card-text>
            <ClientOnly>
              <ApexChart
                type="line"
                height="300"
                :options="aumChartOptions"
                :series="aumChartSeries"
              />
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <div class="flex justify-between items-center">
              Top Funds by AUM
              <v-btn
                variant="text"
                @click="navigateTo('/funds')"
                color="primary"
              >
                See All
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">Code</th>
                  <th class="text-left">Category</th>
                  <th class="text-left">AUM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in topFunds" :key="item.fund_id">
                  <td>{{ item.code }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ formatCurrency(item.aum_value) }}</td>
                </tr>
              </tbody>
            </v-table>
            <!-- <v-list>
              <v-list-item v-for="fund in topFunds" :key="fund.fund_id">
                <v-list-item-title>
                  <div class="flex gap-2">
                    <div class="max-w-sm truncate">{{ fund.name }}</div>
                    ({{ fund.code }})
                  </div>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatCurrency(fund.aum_value) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Revenue Trend</v-card-title>
          <v-card-text>
            <ClientOnly>
              <ApexChart
                type="line"
                height="300"
                :options="revenueChartOptions"
                :series="revenueChartSeries"
              />
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Investor Type</v-card-title>
          <v-card-text>
            <ClientOnly>
              <ApexChart
                type="donut"
                height="300"
                :options="investorDonutOptions"
                :series="investorDonutSeries"
              />
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();
const { user } = useUserSession();

const theme = useTheme();
const selectedDate = ref<Date[]>([]);

const { data: aum } = await $trpc.dashboard.getAum.useQuery();
const { data: revenueSeries } =
  await $trpc.dashboard.getRevenueSeries.useQuery();
const { data: aumSeries } = await $trpc.dashboard.getAumSeries.useQuery();
const { data: investorBreakdown } =
  await $trpc.dashboard.getInvestorTypeBreakdown.useQuery();
const { data: topFunds } = await $trpc.dashboard.getTopFundsByAum.useQuery();

function formatCompactMillions(value: number) {
  return Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: "IDR",
    notation: "compact",
    style: "currency",
  }).format(value);
  // const millions = value / 1_000_000;
  // if (Math.abs(millions) >= 1_000) {
  //   // Fall back to billions if ever needed
  //   const billions = millions / 1_000;
  //   return `${billions.toFixed(0)}B`;
  // }
  // return `${millions.toFixed(0)}M`;
}

const aumChartOptions = computed(() => {
  const categories = (aumSeries.value ?? []).map((row) =>
    new Date(row.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );

  return {
    theme: {
      mode: theme.global.name.value === "dark" ? "dark" : "light",
    },
    chart: {
      id: "aum-line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories,
      labels: { rotate: -45 },
    },
    yaxis: {
      labels: {
        formatter(value: number) {
          return formatCompactMillions(value);
        },
      },
    },
    tooltip: {
      y: {
        formatter(value: number) {
          return formatCompactMillions(value);
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
  };
});

const aumChartSeries = computed(() => [
  {
    name: "AUM",
    data: (aumSeries.value ?? []).map((row) => row.aum_value),
  },
]);

const investorDonutOptions = computed(() => ({
  labels: ["Individual", "Corporate"],
  legend: {
    position: "bottom",
  },
}));

const investorDonutSeries = computed(() => [
  investorBreakdown.value?.individual ?? 0,
  investorBreakdown.value?.corporate ?? 0,
]);

const revenueChartOptions = computed(() => {
  const categories = (revenueSeries.value ?? []).map((row) =>
    new Date(row.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );

  return {
    theme: {
      mode: theme.global.name.value === "dark" ? "dark" : "light",
    },
    chart: {
      theme: {
        mode: theme.global.name.value === "dark" ? "dark" : "light",
      },
      id: "revenue-line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories,
      labels: { rotate: -45 },
    },
    yaxis: {
      labels: {
        formatter(value: number) {
          return formatCompactMillions(value);
        },
      },
    },
    tooltip: {
      y: {
        formatter(value: number) {
          return formatCompactMillions(value);
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
  };
});

const revenueChartSeries = computed(() => [
  {
    name: "Revenue",
    data: (revenueSeries.value ?? []).map((row) => row.management_fee),
  },
]);

const topFundsHeaders = ref([
  { title: "Code", key: "code" },
  { title: "AUM", key: "aum_value" },
]);
</script>
