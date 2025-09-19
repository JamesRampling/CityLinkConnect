<script setup lang="ts">
import HomepageArticle from '@/components/HomePageArticles';
import UserWelcome from '@/components/UserWelcome.vue';
</script>

<template>
  <h1>Hello, World!</h1>

  <div>
    <suspense>
      <UserWelcome />
      <template #fallback>loading... </template>
      <HomepageArticle />
    </suspense>
  </div>
</template>

<style scoped></style>
