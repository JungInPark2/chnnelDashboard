<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { searchMainDashBoardInfo, TestInfo } from '@/api/MainDashBoard';

const { isDarkTheme } = useLayout();

const dashboardInfoYesterday1 = ref({});
const dashboardInfoToday1 = ref({});

onBeforeMount(() => {
  getIfno();
  //getTest();
})

const getTest = async () => {
    const info = await TestInfo();
    console.log('info : ', info);
    console.log('country : ', info.name);
};
const getIfno = async () => {

  const apiNames = ['/web/fin/pu/FINPU010101.do', '/web/fin/mn/FINMN010101.do', '/api/appcard/gcm/ka/GCMKA010101.do'];

  // 전일자 00시부터 전일자 현재시간까지
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const gteTimeYesterday = new Date(yesterday).setHours(0, 0, 0, 0);
  const lteTimeYesterday = new Date(yesterday).setHours(yesterday.getHours(), yesterday.getMinutes(), yesterday.getSeconds(), 999);

  const dashboardInfoYesterday = await searchMainDashBoardInfo(apiNames, new Date(gteTimeYesterday).toISOString(), new Date(lteTimeYesterday).toISOString());
  console.log('Yesterday:', dashboardInfoYesterday);

  // 오늘 00시부터 오늘 현재시간까지
  const now = new Date();
  const gteTimeToday = new Date(now).setHours(0, 0, 0, 0);
  const lteTimeToday = now.toISOString();

  const dashboardInfoToday = await searchMainDashBoardInfo(apiNames, new Date(gteTimeToday).toISOString(), lteTimeToday);
  console.log('Today:', dashboardInfoToday);

  dashboardInfoYesterday1.value = dashboardInfoYesterday;
  dashboardInfoToday1.value = dashboardInfoToday;
  
};

watch(dashboardInfoYesterday1, (newVal, oldVal) => {
    if (newVal && newVal.hits && newVal.hits.total) {
        lineData.datasets[0].data[6] = newVal.hits.total.value;
    }
});

const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, dashboardInfoYesterday1.value?.hits?.total?.value || 0],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);

const lineOptions = ref({
    responsive: true, // 반응형 옵션 활성화
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
  <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Sales Overview</h5>
            <Chart type="doughnut" :data="lineData" :options="lineOptions" />
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Sales Overview</h5>
            <Chart type="pie" :data="lineData" :options="lineOptions" />
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Sales Overview</h5>
            <Chart type="bar" :data="lineData" :options="lineOptions" />
        </div>
    </div>
</template>
