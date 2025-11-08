<script setup lang="ts">
import IconBack from '@/components/icons/IconBack.vue';
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
      <router-link class="back-button button-filled" to="/"
        ><IconBack />Back</router-link
      >
      <hgroup>
        <h1>{{ announcement.title }}</h1>
        <p>
          <time :datetime="announcement.date">{{
            formatDate(announcement.date, { dateStyle: 'full' })
          }}</time>
        </p>
      </hgroup>
      <p>{{ announcement.content }}</p>
    </div>
  </template>
</template>

<style scoped>
.back-button {
  width: fit-content;
}

time {
  color: var(--color-muted);
  font-weight: 700;
  font-size: 1.25rem;
}
</style>
