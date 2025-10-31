<script setup lang="ts">
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';

defineProps<{ serviceId: number }>();

// TODO: hook up to server
const serviceName = 'Pet Registration';
</script>

<template>
  <div class="page-wrapper">
    <h1>Book a service &mdash; {{ serviceName }}</h1>
    <form class="form" action="" @submit.prevent>
      <InputText type="date" name="date-input" label="Date" />

      <InputTextarea name="service-notes" label="Additional information" />

      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>
  </div>
</template>
