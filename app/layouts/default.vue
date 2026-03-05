<template>
  <v-layout class="rounded-md border">
    <v-app-bar title="Qiblat Unit Registry">
      <template #append>
        <v-btn @click="theme.toggle()" icon>
          <v-icon>
            {{
              theme.global.name.value === "dark"
                ? "mdi-weather-night"
                : "mdi-weather-sunny"
            }}
          </v-icon>
        </v-btn>
      </template>
    </v-app-bar>

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
            <v-icon :color="menu.iconColor">{{ menu.icon }}</v-icon>
          </template>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list-item @click="logout">
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-main class="d-flex justify-center">
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
const theme = useTheme();

const { clear } = useUserSession();
const menus = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/",
    iconColor: "primary",
  },
  {
    title: "Investors",
    icon: "mdi-account-group",
    to: "/investors",
    iconColor: "secondary",
  },
  {
    title: "Transactions",
    icon: "mdi-file-chart",
    to: "/transactions",
    iconColor: "yellow",
  },
  {
    title: "Funds",
    icon: "mdi-bank",
    to: "/funds",
    iconColor: "green",
  },
  {
    title: "NAVs",
    icon: "mdi-chart-line",
    to: "/navs",
    iconColor: "blue",
  },
  {
    title: "Agents",
    icon: "mdi-account-group-outline",
    to: "/agents",
    iconColor: "purple",
  },
  {
    title: "References",
    icon: "mdi-database-settings",
    to: "/references",
    iconColor: "orange",
  },
  {
    title: "Reporting",
    icon: "mdi-file-chart",
    to: "/reporting",
    iconColor: "red",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    to: "/settings",
    iconColor: "gray",
  },
];

async function logout() {
  await clear();
  await navigateTo("/login");
}
</script>
