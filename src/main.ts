import '@/assets/global.css';

import App from '@/App.vue';
import router from '@/routes';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.mount('#app');
