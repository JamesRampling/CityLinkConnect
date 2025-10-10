<template>
  <div class="announcement-article-mobile">
    <h2 class="title">{{ title }}</h2>
    <p class="meta">By {{ author }} on {{ date }}</p>
    <p class="summary">{{ summary }}</p>
    <img
      src="/favicon.svg"
      alt="Announcement Image"
      class="announcement-image"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AnnouncementArticle',
  props: {
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
  },
});
</script>
