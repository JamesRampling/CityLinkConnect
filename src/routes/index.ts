import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from 'vue-router';

import AboutView from '@/routes/AboutView.vue';
import AdminPage from '@/routes/AdminPage.vue';
import AnnouncementView from '@/routes/AnnouncementView.vue';
import BookingFormView from '@/routes/BookingFormView.vue';
import FeedbackFormView from '@/routes/FeedbackFormView.vue';
import HomeView from '@/routes/HomeView.vue';
import LoginView from '@/routes/LoginView.vue';
import NotFoundView from '@/routes/NotFoundView.vue';
import ServiceListView from '@/routes/ServiceListView.vue';
import UserProfileView from '@/routes/UserProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/services', component: ServiceListView },
    {
      path: '/booking/:id',
      component: BookingFormView,
      props: convertProps({ id: Number }),
    },
    {
      path: '/announcement/:id',
      component: AnnouncementView,
      props: convertProps({ id: Number }),
    },
    {
      path: '/user/:id',
      component: UserProfileView,
      props: convertProps({ id: Number }),
    },
    { path: '/login', component: LoginView },
    { path: '/feedback', component: FeedbackFormView },
    { path: '/:catchAll(.*)*', component: NotFoundView },
    { path: '/admin', component: AdminPage },
  ],
});

function convertProps(
  types: Record<string, ((param: string | string[]) => unknown) | undefined>,
) {
  return function (route: RouteLocationNormalized) {
    const params = route.params;

    return Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, types[k]?.(v) ?? v]),
    );
  };
}

export default router;
