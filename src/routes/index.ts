import { createRouter, createWebHistory } from 'vue-router';

import AboutView from '@/routes/AboutView.vue';
import AnnouncementView from '@/routes/AnnouncementView.vue';
import BookingFormView from '@/routes/BookingFormView.vue';
import BookingsView from '@/routes/BookingsView.vue';
import FeedbackFormView from '@/routes/FeedbackFormView.vue';
import HomeView from '@/routes/HomeView.vue';
import LoginView from '@/routes/LoginView.vue';
import UserProfileView from '@/routes/UserProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/bookings', component: BookingsView },
    { path: '/booking/:serviceId', component: BookingFormView },
    { path: '/announcement/:id', component: AnnouncementView },
    { path: '/user/:id', component: UserProfileView },
    { path: '/login', component: LoginView },
    { path: '/feedback', component: FeedbackFormView },
  ],
});

export default router;
