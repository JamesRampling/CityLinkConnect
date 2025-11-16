import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/routes/HomeView.vue') },
    { path: '/about', component: () => import('@/routes/AboutView.vue') },
    {
      path: '/services',
      component: () => import('@/routes/ServiceListView.vue'),
    },
    {
      path: '/booking/:id',
      component: () => import('@/routes/BookingFormView.vue'),
      props: convertProps({ id: Number }),
    },
    {
      path: '/announcement/:id',
      component: () => import('@/routes/AnnouncementView.vue'),
      props: convertProps({ id: Number }),
    },
    {
      path: '/user/:id',
      component: () => import('@/routes/UserProfileView.vue'),
      props: convertProps({ id: Number }),
    },
    { path: '/login', component: () => import('@/routes/LoginView.vue') },

    { path: '/register', component: () => import('@/routes/RegisterView.vue') },
    {
      path: '/feedback',
      component: () => import('@/routes/FeedbackFormView.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      component: () => import('@/routes/NotFoundView.vue'),
    },
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
