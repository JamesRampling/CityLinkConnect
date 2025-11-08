<script setup lang="ts">
import IconBack from '@/components/icons/IconBack.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
import { useExampleData } from '@/exampleData';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const { services } = useExampleData();

// TODO: hook up to server
const service = computed(() => services.value[props.id]);
</script>

<template>
  <div class="page-wrapper">
    <router-link class="back-button button-filled" to="/services"
      ><IconBack />Back</router-link
    >
    <h1>Book a service</h1>

    <div class="content-wrapper">
      <section class="section-service-info">
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
                <strong class="fee-name">{{ title }}</strong> &ndash;
                {{ price }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div class="separator"></div>

      <section class="section-form">
        <h2>Booking details</h2>
        <form class="form" action="" @submit.prevent>
          <InputText type="date" name="date-input" label="Date" />

          <InputTextarea name="service-notes" label="Additional information" />

          <div class="button-row">
            <button type="submit" class="button-filled">Submit</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.back-button {
  width: fit-content;
}

.content-wrapper {
  display: grid;
  gap: 2rem;
}

.fee {
  margin-block-end: 1rem;
}

.fee-name {
  text-transform: capitalize;
}
</style>
