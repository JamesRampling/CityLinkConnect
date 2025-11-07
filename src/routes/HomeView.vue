<script setup lang="ts">
const articles = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  title: 'Scheduled Road Maintenance',
  date: new Date(`2025-10-${(i + 1).toString().padStart(2, '0')}`),
  content: `
      The council will begin scheduled road maintenance on Main Street and
      adjoining roads from the 10th of October to the 14th of October.
      Residents are advised to plan alternative routes.
    `,
}));
</script>

<template>
  <!--Photo by Alex Reynolds on Unsplash https://unsplash.com/photos/aerial-view-of-suburban-buildings-and-distant-city-skyline-yt7Jc2S8y0I -->
  <img src="/src/assets/hero-splash.jpg" />
  <div class="page-wrapper">
    <h1>CityLink Connect</h1>

    <article
      v-for="item in articles"
      :key="item.title"
      class="clickable-card"
      @click="$router.push(`/announcement/${item.id}`)"
    >
      <h2>{{ item.title }}</h2>
      <h3>{{ item.date.toLocaleDateString('en-AU') }}</h3>
      <p>{{ item.content }}</p>
    </article>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  min-height: 6rem;
  aspect-ratio: 10/1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-wrapper {
  display: grid;
  gap: 1rem;
  padding-block-end: 2rem;

  h1 {
    margin-block: 0;
  }
}

article {
  h2 {
    margin: 0;
  }

  h3 {
    margin-block-start: 0.5rem;
    margin-block-end: 0;
  }

  p {
    margin-block-start: 0.5rem;
    margin-block-end: 0;
  }
}
</style>
