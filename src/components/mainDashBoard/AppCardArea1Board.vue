<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const { isDarkTheme } = useLayout();
const authTypes = ref({});
const payTypes = ref({});
const pieOptions = ref({});
const barOptions = ref({});

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const setChart = () => {

  console.log('인증별 API호출 건수');

  // TODO 인증 수 가져오기 
  // ARS인증(auttr), 공인인증, fido인증, 카드비밀번호인증, cvv인증, sms인증, 결제비밀번호인증 
  // aut010201 autct0101 autfd0102 authc0101 autmp0102 autpp0101 
  authTypes.value = {
    labels: ['ARS인증', '공인인증', 'fido인증', '카드비밀번호인증' ,'cvc인증', 'sms인증', '결제비밀번호인증'],
    datasets: [
        {
            data: [200,250,340,234,21,234,444],
            backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--primary-500'), documentStyle.getPropertyValue('--green-500'), 
            documentStyle.getPropertyValue('--pink-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--yellow-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--primary-400'), documentStyle.getPropertyValue('--green-400'), 
            documentStyle.getPropertyValue('--pink-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--yellow-400')]
        }
    ]
  };

  pieOptions.value = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
  };

  payTypes.value = {
      labels: ['Apple pay', '배민페이', 'carPay', '카카오페이', 'L.PAY', '네이버', 'SSG', '스마일페이', '삼성페이', '토스페이', 'TV페이'],
      datasets: [
          {
              label: '10분전',
              backgroundColor: documentStyle.getPropertyValue('--pink-200'),
              borderColor: documentStyle.getPropertyValue('--pink-200'),
              data: [65, 59, 80, 81, 56, 55, 40, 20, 100, 33, 23]
          },
          {
              label: '지금',
              backgroundColor: documentStyle.getPropertyValue('--pink-500'),
              borderColor: documentStyle.getPropertyValue('--pink-500'),
              data: [28, 48, 40, 19, 86, 27, 90, 30, 20, 10, 88]
          }
      ]
  };

  barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,documentStyle,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

  
}

const dashboardInfoYesterday1 = ref({});
const dashboardInfoToday1 = ref({});

onBeforeMount(() => {
  setColorOptions();
  setChart();
})

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
    <div class="card flex flex-column align-items-center">
        <h5 class="text-left w-full">인증시도 횟수</h5>
        <Chart type="pie" :data="authTypes" :options="pieOptions"></Chart>
    </div>
  </div>
  <div class="col-12 xl:col-6">
    <div class="card align-items-center">
        <h5 class="text-left w-full">ooPay등록</h5>
        <Chart type="bar" :data="payTypes" :options="barOptions"></Chart>
    </div>
  </div>
</template>
