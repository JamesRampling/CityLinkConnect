<script setup lang="ts">
import AccessibilityPopup from '@/components/AccessibilityPopup.vue';
import IconAccessibility from '@/components/icons/IconAccessibility.vue';
import IconMenu from '@/components/icons/IconMenu.vue';
import IconUser from '@/components/icons/IconUser.vue';

import { useUser } from '@/user';
import { ref } from 'vue';

const userState = useUser();

const accessibilityButton = ref<HTMLButtonElement>();
const accessibilityPopup = ref<InstanceType<typeof AccessibilityPopup>>();

const hamburgerMenuExpanded = ref(false);
</script>

<template>
  <header class="">
    <img class="logo-image" src="/favicon.svg" alt="" />

    <button
      class="nav-toggle-button button-outlined"
      @click.stop="hamburgerMenuExpanded = !hamburgerMenuExpanded"
    >
      <IconMenu />
    </button>

    <nav
      class="nav-list"
      :data-expanded="hamburgerMenuExpanded || undefined"
      @click="hamburgerMenuExpanded = false"
    >
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/services">Service Bookings</router-link>
      <router-link to="/feedback">Feedback</router-link>
    </nav>

    <div class="end-header-buttons">
      <button
        ref="accessibilityButton"
        class="button-outlined"
        @click="accessibilityPopup?.show()"
      >
        <IconAccessibility />Accessiblity
      </button>

      <span v-if="userState === undefined">
        <router-link to="/login" class="button-filled">Login</router-link>
      </span>
      <span v-else>
        <router-link :to="`/user/${userState.id}`" class="button-outlined">
          <IconUser />
          {{ userState.display_name }}
        </router-link>
      </span>
    </div>
  </header>
  <main>
    <router-view />
  </main>
  <div
    class="nav-menu-backdrop"
    :data-expanded="hamburgerMenuExpanded || undefined"
    @click="hamburgerMenuExpanded = false"
  ></div>
  <AccessibilityPopup ref="accessibilityPopup" :target="accessibilityButton!" />
</template>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--header-border-color);

  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--header-bgcolor);
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

.nav-toggle-button {
  display: none;
}

.nav-menu-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--backdrop-color);
  display: none;
  z-index: 100;
}

@media (width < 100ch) {
  .nav-toggle-button {
    display: flex;
  }

  .nav-list {
    display: none;
    background: var(--header-bgcolor);
    z-index: 1000;
    flex-direction: column;
    padding-bottom: 0.5rem;
  }

  .nav-list[data-expanded] {
    display: flex;
    flex-basis: 100%;
    order: 1;
  }

  .nav-menu-backdrop[data-expanded] {
    display: block;
  }
}

.end-header-buttons {
  flex-grow: 1;
  justify-content: end;
  display: flex;
  gap: 1rem;
}
</style>
