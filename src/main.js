import '@/assets/styles.scss';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const app = createApp(App)
app.use(PrimeVue, { ripple: true });
app.use(createPinia())
app.use(router)

app.component('Dropdown', Dropdown);
app.component('InputText', InputText);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);

app.mount('#app')
