import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

createApp(App).use(router).use(Antd).use(createPinia()).mount('#app')
// app.use(Antd);
// app.use(createPinia())
// app.use(router)
// app.mount('#app')



