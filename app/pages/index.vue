<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title> Asset Under Management </v-card-title>
          <v-card-text class="flex flex-col items-start gap-4 mt-2">
            <!-- <v-icon>mdi-cash-multiple</v-icon> -->
            <span class="font-bold text-xl">{{
              formatCurrency(aum?.aum ?? 0)
            }}</span>

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
  </v-container>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const { data: aum } = await $trpc.dashboard.getAum.useQuery();
</script>
