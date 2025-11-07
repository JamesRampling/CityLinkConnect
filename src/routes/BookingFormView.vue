<script setup lang="ts">
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import { useExampleData } from '@/exampleData';
import { computed } from 'vue';

const props = defineProps<{ serviceId: number }>();

const { services } = useExampleData();

// TODO: hook up to server
const service = computed(() => services.value[props.serviceId]);
</script>

<template>
  <div class="page-wrapper">
    <h1>Book a service</h1>
    <h2>{{ service.name }}</h2>
    <p>{{ service.description }}</p>

    <div v-if="service.fees" class="fees">
      <div
        v-for="[fee, prices] of Object.entries(service.fees)"
        :key="fee"
        class="fee"
      >
        <h3>{{ fee }}</h3>
        <ul>
          <li v-for="[title, price] of Object.entries(prices)" :key="title">
            {{ title }} - {{ price }}
          </li>
        </ul>
      </div>
    </div>

    <form class="form" action="" @submit.prevent>
      <InputText type="date" name="date-input" label="Date" />

      <InputTextarea name="service-notes" label="Additional information" />

      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
}
</style>
