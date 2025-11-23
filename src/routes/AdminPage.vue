<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { defineAsyncComponent, type ComponentPublicInstance } from 'vue';

defineProps<{ selectedPage: string }>();

const UsersManagementView = defineAsyncComponent(
  () => import('@/routes/admin/UsersManagementView.vue'),
);
const BookingsManagementView = defineAsyncComponent(
  () => import('@/routes/admin/BookingsManagementView.vue'),
);
const AnnouncementsManagementView = defineAsyncComponent(
  () => import('@/routes/admin/AnnouncementsManagementView.vue'),
);
const ServicesManagementView = defineAsyncComponent(
  () => import('@/routes/admin/ServicesManagementView.vue'),
);
const FeedbackManagementView = defineAsyncComponent(
  () => import('@/routes/admin/FeedbackManagementView.vue'),
);

const pages = [
  { id: 'users', name: 'Users' },
  { id: 'bookings', name: 'Bookings' },
  { id: 'announcements', name: 'Announcements' },
  { id: 'services', name: 'Services' },
  { id: 'feedback', name: 'Feedback' },
];

// Ensure selected tab is in view when navigating to admin page.
function scrollIntoView(element: Element | ComponentPublicInstance | null) {
  if (element instanceof Element) {
    const selected = element.querySelector('.selected');
    requestAnimationFrame(() => {
      selected?.scrollIntoView();
    });
  }
}
</script>

<template>
  <div class="title-wrapper page-wrapper">
    <h1 class="title">Admin Options</h1>
  </div>

  <div class="tab-wrapper">
    <div
      :ref="(e) => scrollIntoView(e)"
      class="tab-bar page-wrapper"
      role="tablist"
    >
      <router-link
        v-for="page in pages"
        :id="selectedPage === page.id ? 'selected-tab' : undefined"
        :key="page.id"
        :to="`/admin/${page.id}`"
        :class="{ tab: true, selected: selectedPage === page.id }"
        role="tab"
        :aria-selected="selectedPage === page.id"
        :aria-expanded="selectedPage === page.id"
        aria-controls="tab-panel"
      >
        {{ page.name }}
      </router-link>
    </div>
  </div>

  <div
    id="tab-panel"
    class="page-wrapper"
    role="tabpanel"
    aria-labelledby="selected-tab"
  >
    <Suspense :key="selectedPage">
      <UsersManagementView v-if="selectedPage === 'users'" />
      <BookingsManagementView v-else-if="selectedPage === 'bookings'" />
      <AnnouncementsManagementView
        v-else-if="selectedPage === 'announcements'"
      />
      <ServicesManagementView v-else-if="selectedPage === 'services'" />
      <FeedbackManagementView v-else-if="selectedPage === 'feedback'" />

      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </div>
</template>

<style lang="css" scoped>
.title-wrapper {
  padding-block-end: 0;

  .title {
    margin-block: 1rem 1.5rem;
  }
}

.tab-wrapper {
  background-color: var(--bgcolor);
  user-select: none;

  position: sticky;
  top: 3.5rem;

  .tab-bar {
    display: flex;
    padding: 0;
    width: calc(100% - 2rem);
    max-width: calc(90ch - 2rem);
    overflow: auto;
    border-bottom: 1px solid var(--border-color);
  }

  .tab {
    padding: 1rem 1.5rem;

    text-align: center;
    font-size: medium;
    background-color: transparent;

    cursor: pointer;

    border: none;

    color: inherit;
    text-decoration: none;
    position: relative;

    &:hover,
    &:focus-visible {
      background-color: var(--button-outlined-hover-bgcolor);
    }

    &.selected::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      border-bottom: 4px solid var(--accent-color);
    }
  }
}
</style>
