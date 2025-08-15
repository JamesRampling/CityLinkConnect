<script setup lang="ts"></script>

<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1.5rem;
}

main {
  padding-block-start: 0.5rem;
}
</style>
