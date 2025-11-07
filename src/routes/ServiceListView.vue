<script setup lang="ts">
import { useExampleData } from '@/exampleData';

// TODO: hook up to server
const { services } = useExampleData();
</script>

<template>
  <div class="page-wrapper">
    <h1>Service Bookings</h1>

    <div class="service-list">
      <article
        v-for="[idx, item] in services.entries()"
        :key="idx"
        class="clickable-card"
        @click="$router.push(`/booking/${idx}`)"
      >
        <h2>{{ item.name }}</h2>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
article {
  h2,
  p {
    margin: 0;
  }
}

.service-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(25ch, 1fr));
}
</style>
