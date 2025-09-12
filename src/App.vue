<script setup lang="ts">
import IconAccessibility from '@/components/icons/IconAccessibility.vue';

// const
</script>

<template>
  <header>
    <img class="logo-image" src="/favicon.svg" alt="" />
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/bookings">Service Bookings</router-link>
      <router-link to="/feedback">Feedback</router-link>
    </nav>
    <div class="end-header-buttons">
      <button class="button-outlined"><IconAccessibility />Accessiblity</button>
      <button class="button-filled">Login</button>
    </div>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
header {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--header-border-color);
}

.logo-image {
  width: 2.5rem;

  @media (prefers-color-scheme: dark) {
    filter: invert(1) hue-rotate(180deg) brightness(1.2);
  }
}

nav {
  display: flex;
  gap: 1.5rem;

  a {
    color: var(--header-color);
  }
}

.end-header-buttons {
  flex-grow: 1;
  justify-content: end;
  display: flex;
  gap: 1rem;
}

main {
  padding-block-start: 0.5rem;
}
</style>
