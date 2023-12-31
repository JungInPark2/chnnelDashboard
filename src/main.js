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
import Chart from 'primevue/chart';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import MultiSelect from 'primevue/multiselect';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const app = createApp(App)
app.use(PrimeVue, { ripple: true });
app.use(createPinia())
app.use(router)
app.use(ToastService);

app.component('Dropdown', Dropdown);
app.component('InputText', InputText);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Chart', Chart);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('MultiSelect', MultiSelect);
app.component('Toast', Toast);

app.mount('#app')
