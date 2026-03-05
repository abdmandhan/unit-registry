<template>
  <v-layout class="rounded-md border">
    <v-app-bar title="Qiblat Unit Registry"></v-app-bar>

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item
          v-for="menu in menus"
          :key="menu.title"
          :title="menu.title"
          :to="menu.to"
          :active="$route.path === menu.to"
        >
          <template #prepend>
            <v-icon>{{ menu.icon }}</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex justify-center">
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
const menus = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/",
  },
  {
    title: "Investors",
    icon: "mdi-account-group",
    to: "/investors",
  },
  {
    title: "Transactions",
    icon: "mdi-file-chart",
    to: "/transactions",
  },
];
</script>
