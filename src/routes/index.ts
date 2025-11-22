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
      component: () => import('@/routes/service/ServiceListView.vue'),
    },
    {
      path: '/services/book/:id',
      component: () => import('@/routes/service/BookingFormView.vue'),
      props: convertProps({ id: Number }),
    },
    {
      path: '/services/edit/:id',
      component: () => import('@/routes/service/EditServiceView.vue'),
      props: convertProps({ id: Number }),
    },

    {
      path: '/announcement/view/:id',
      component: () => import('@/routes/announcement/ViewAnnouncementView.vue'),
      props: convertProps({ id: Number }),
    },
    {
      path: '/announcement/edit/:id',
      component: () => import('@/routes/announcement/EditAnnouncementView.vue'),
      props: convertProps({ id: Number }),
    },

    { path: '/admin', component: () => import('@/routes/AdminPage.vue') },

    { path: '/account', component: () => import('@/routes/MyProfile.vue') },
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
