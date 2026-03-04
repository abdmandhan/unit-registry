<template>
  <v-app>
    <v-main>
      <v-btn @click="test"> test </v-btn>
      {{ hello }}
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
const { $trpc } = useNuxtApp();
const { data } = await useFetch("/api/test");
const { data: hello } = await $trpc.hello.useQuery({ text: "client" });

const test = async () => {
  const { data } = await useFetch("/api/test", {
    method: "POST",
    body: { name: "John Doe" },
  });
};
</script>
