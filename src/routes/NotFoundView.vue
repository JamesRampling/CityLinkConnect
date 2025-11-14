<template>
  <div class="not-found">
    <h1>404 &mdash; Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/" class="button-filled">Go back to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 1rem;
}

h1 {
  margin-block-end: 1rem;
}
</style>
