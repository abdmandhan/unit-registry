<template>
  <v-theme-provider theme="dark">
    <v-app>
      <v-defaults-provider
        :defaults="{
          VSelect: { density: 'compact', color: 'primary' },
          VDataTable: { density: 'compact', color: 'primary' },
          VDataTableServer: { density: 'compact', color: 'primary' },
          VTextField: { density: 'compact', color: 'primary' },
          VSwitch: { density: 'compact', color: 'primary' },
        }"
      >
        <NuxtLayout>
          <NuxtLoadingIndicator />
          <NuxtPage />
        </NuxtLayout>
      </v-defaults-provider>
    </v-app>
  </v-theme-provider>
</template>

<script lang="ts" setup></script>
