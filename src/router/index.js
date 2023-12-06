import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue';
import MainView from '@/views/MainView.vue'
import EventView from '@/views/EventView.vue'
import XmpView from '@/views/XmpView.vue'
import ErrorView from '@/views/ErrorView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: AppLayout, 
      children: [
        { path: '/', name: '통합로그', component: MainView },
        { path: '/eventLog', name: 'eventLog', component: EventView  },
        { path: '/xmpLog', name: 'xmpLog', component: XmpView  },
        { path: '/error', name: 'error', component: ErrorView  }
    ]},
  ]
});

export default router
