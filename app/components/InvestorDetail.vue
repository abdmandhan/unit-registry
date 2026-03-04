<template>
  <v-form>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        {{ investorId }}
        <v-btn color="primary" @click="submit">SUBMIT</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="First Name" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
const { $trpc } = useNuxtApp();

const props = defineProps<{
  investorId: string;
}>();

const { data: investor } = await $trpc.get.useQuery({ id: props.investorId });

if (!investor) {
  throw new Error("Investor not found");
}

const submit = () => {
  console.log("submit");
};
</script>
