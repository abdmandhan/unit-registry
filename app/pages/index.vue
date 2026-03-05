<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title> Asset Under Management </v-card-title>
          <v-card-text class="flex flex-col items-start gap-4 mt-2">
            <!-- <v-icon>mdi-cash-multiple</v-icon> -->
            <span class="font-bold text-3xl text-right">
              {{ formatCurrency(aum?.aum ?? 0) }}
            </span>

            <div class="flex gap-2 items-center">
              <v-chip color="primary" size="small">
                <v-icon>mdi-arrow-up</v-icon>
                <span>{{ aum?.aumDiffPercentage }}%</span>
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

const { data: aum } = await $trpc.dashboard.getAum.useQuery();
const { data: aumSeries } = await $trpc.dashboard.getAumSeries.useQuery();
const { data: investorBreakdown } =
  await $trpc.dashboard.getInvestorTypeBreakdown.useQuery();

function formatCompactMillions(value: number) {
  const millions = value / 1_000_000;
  if (Math.abs(millions) >= 1_000) {
    // Fall back to billions if ever needed
    const billions = millions / 1_000;
    return `${billions.toFixed(0)}B`;
  }
  return `${millions.toFixed(0)}M`;
}

const aumChartOptions = computed(() => {
  const categories = (aumSeries.value ?? []).map((row) =>
    new Date(row.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }),
  );

  return {
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
</script>
