<script setup lang="ts">
import AccessibilityMenu from '@/components/AccessibilityMenu.vue';
import IconAdmin from '@/components/icons/IconAdmin.vue';
import IconMenu from '@/components/icons/IconMenu.vue';
import IconUser from '@/components/icons/IconUser.vue';
import { useUser } from '@/user';
import { useMediaQuery } from '@/utils/mediaQuery';
import { ref } from 'vue';

const { userInfo, auth } = useUser();
const hamburgerMenuExpanded = ref(false);

const { matches: isNarrowScreen } = useMediaQuery('(width < 100ch)');
</script>

<template>
  <header>
    <img class="logo-image" src="/favicon.svg" alt="" />

    <button
      class="nav-toggle-button button-outlined"
      aria-label="Toggle navigation menu"
      @click.stop="hamburgerMenuExpanded = !hamburgerMenuExpanded"
    >
      <IconMenu aria-hidden="true" />
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
      <AccessibilityMenu :label-hidden="isNarrowScreen" />

      <template v-if="userInfo === undefined">
        <router-link to="/login" class="button-filled">Login</router-link>
      </template>
      <template v-else>
        <router-link :to="`/account`" class="button-outlined">
          <IconAdmin v-if="auth?.is_admin" aria-label="Admin user" />
          <IconUser v-else aria-label="User" />
          <template v-if="!isNarrowScreen">{{ userInfo.given_names }}</template>
        </router-link>
      </template>
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
  color: var(--header-color);
}

.logo-image {
  width: 2.5rem;
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

@media (width < 80ch) {
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
