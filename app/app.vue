<template>
  <v-app>
    <v-main>
      <v-btn @click="test"> test </v-btn>
      {{ data?.first_name }}
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
const { data } = await useFetch("/api/test");

const test = async () => {
  const { data } = await useFetch("/api/test", {
    method: "POST",
    body: { name: "John Doe" },
  });
};
</script>
