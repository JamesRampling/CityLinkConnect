<template>
  <article class="announcement-article">
    <h2 class="title">{{ title }}</h2>
    <p class="meta">
      <span class="author">By {{ author }}</span> |
      <span class="date">{{ date }}</span>
    </p>
    <p class="summary">{{ summary }}</p>
  </article>
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

<style scoped>
.announcement-article {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #fafafa;
}
.title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #333;
}
.meta {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
}
.summary {
  font-size: 1.1rem;
  color: #444;
}
</style>
