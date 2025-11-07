<script setup lang="ts">
import { useExampleData } from '@/exampleData';
import NotFoundView from '@/routes/NotFoundView.vue';
import { formatDate } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const { announcements } = useExampleData();
const announcement = computed(() => announcements.value[props.id]);
</script>

<template>
  <template v-if="announcement === undefined">
    <NotFoundView />
  </template>
  <template v-else>
    <div class="page-wrapper">
      <h1>{{ announcement.title }}</h1>
      <p>{{ formatDate(announcement.date, { dateStyle: 'full' }) }}</p>
      <p>{{ announcement.content }}</p>
    </div>
  </template>
</template>
