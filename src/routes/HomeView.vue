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
  color: var(--card-color);
  background-color: var(--card-bgcolor);
  border: 1px solid var(--card-border-color);
  border-radius: 2rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: box-shadow 200ms;

  &:hover {
    box-shadow: 0 10px 16px light-dark(rgb(0 0 0 / 0.35), rgb(0 0 0 / 0.9));
  }

  &:active {
    transition-duration: 100ms;
    box-shadow: 0 5px 8px rgb(0 0 0 / 0.5);
  }

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
