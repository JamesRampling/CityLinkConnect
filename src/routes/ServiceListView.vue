<script setup lang="ts">
// TODO: hook up to server
const services = [
  { id: 1, name: 'Pet Registration', description: 'Register an animal.' },
  {
    id: 2,
    name: 'Bin Collection',
    description: 'Find out more about waste collection services.',
  },
];
</script>

<template>
  <div class="page-wrapper">
    <h1>Service Bookings</h1>

    <div class="card-grid">
      <article
        v-for="item in services"
        :key="item.id"
        class="clickable-card"
        @click="$router.push(`/booking/${item.id}`)"
      >
        <h2>{{ item.name }}</h2>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
article {
  h2,
  p {
    margin: 0;
  }
}

.card-grid {
  margin-block-start: 2rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
