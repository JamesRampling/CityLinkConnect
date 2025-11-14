<script setup lang="ts">
import { useExampleData } from '@/exampleData';
import { computed } from 'vue';

const { services } = useExampleData();

const serviceItems = computed(() =>
  services.value.map((e, i) => ({ config: e, service_id: i })),
);
</script>

<template>
  <div class="page-wrapper">
    <h1>Service Bookings</h1>

    <div class="service-list">
      <router-link
        v-for="{ service_id, config } in serviceItems"
        :key="service_id"
        :to="`/booking/${service_id}`"
        class="card clickable"
      >
        <h2 class="title">{{ config.name }}</h2>
        <p>{{ config.description }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.service-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(30ch, 1fr));
}
</style>
