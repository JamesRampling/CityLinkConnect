<script setup lang="ts">
import api from '@/api';
import ApiErrorMessage from '@/components/ApiErrorMessage.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import LoadedData from '@/components/LoadedData.vue';
</script>

<template>
  <div class="page-wrapper">
    <h1>Service Bookings</h1>

    <LoadedData :action="() => api.services.all()">
      <template #ok="{ data: services }">
        <div class="service-list">
          <router-link
            v-for="{ service_id, config } in services"
            :key="service_id"
            :to="`/services/book/${service_id}`"
            class="card clickable"
          >
            <h2 class="title">{{ config.name }}</h2>
            <p>{{ config.description }}</p>
          </router-link>
        </div>
      </template>

      <template #error="{ error, retry }">
        <ApiErrorMessage :error>
          <button class="button-filled" @click="retry()">
            <IconRefresh />Retry
          </button>
        </ApiErrorMessage>
      </template>
    </LoadedData>
  </div>
</template>

<style scoped>
.service-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(30ch, 1fr));
}
</style>
