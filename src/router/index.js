import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';
import MainView from '@/views/MainView.vue'
import EventView from '@/views/EventView.vue'
import XmpView from '@/views/XmpView.vue'
import CommonView from '@/views/CommonView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: AppLayout, 
      children: [
        { path: '/', name: '통합로그', component: MainView },
        { path: '/eventLog', name: 'eventLog', component: EventView  },
        { path: '/xmpLog', name: 'xmpLog', component: XmpView  },
        { path: '/common', name: 'common', component: CommonView  }
    ]},
  ]
});

export default router
