import { createRouter, createWebHistory } from 'vue-router';

import AboutView from '@/routes/AboutView.vue';
import HomeView from '@/routes/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
  ],
});

export default router;
