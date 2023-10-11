<script setup>
import { onBeforeMount, ref, watch } from 'vue';

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const authTypes = ref({});
const authOptions = ref({});
const authList = ref([]);
const oopayTypes = ref({});
const oopayOptions = ref({});
const oopayList = ref([]);
const yesterDayoopayList = ref([]);

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
    labels: ['ARS인증', '공인인증', 'fido인증', '카드비밀번호인증' , 'sms인증', '결제비밀번호인증'],
    datasets: [
        {
            data: authList.value,
            backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--primary-500'), documentStyle.getPropertyValue('--green-500'), 
            documentStyle.getPropertyValue('--pink-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--yellow-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--primary-400'), documentStyle.getPropertyValue('--green-400'), 
            documentStyle.getPropertyValue('--pink-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--yellow-400')]
        }
    ]
  };

  authOptions.value = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
  };

  oopayTypes.value = {
      labels: ['Apple pay', '배민페이', 'carPay', '카카오페이', 'L.PAY', '네이버', 'SSG', '스마일페이', '삼성페이', '토스페이', 'TV페이'],
      datasets: [
          {
              label: '하루전',
              backgroundColor: documentStyle.getPropertyValue('--pink-200'),
              borderColor: documentStyle.getPropertyValue('--pink-200'),
              data: yesterDayoopayList.value
          },
          {
              label: '오늘',
              backgroundColor: documentStyle.getPropertyValue('--pink-500'),
              borderColor: documentStyle.getPropertyValue('--pink-500'),
              data: oopayList.value
          }
      ]
  };

  oopayOptions.value = {
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

const getPayInfo = () => {

    //TODO axios 로 변경
    fetch('demo/oopay.json')
		.then((res) => res.json())
		.then((data) => {  
      // 오늘~지금까지
      oopayList.value.push(data.aggregations.AP.doc_count);
      oopayList.value.push(data.aggregations.BM.doc_count);
      oopayList.value.push(data.aggregations.HC.doc_count);
      oopayList.value.push(data.aggregations.KP.doc_count);
      oopayList.value.push(data.aggregations.LP.doc_count);
      oopayList.value.push(data.aggregations.NP.doc_count);
      oopayList.value.push(data.aggregations.SG.doc_count);
      oopayList.value.push(data.aggregations.SM.doc_count);
      oopayList.value.push(data.aggregations.SP.doc_count);
      oopayList.value.push(data.aggregations.TO.doc_count);
      oopayList.value.push(data.aggregations.TV.doc_count);
      
      //TODO 어제 일자
      yesterDayoopayList.value.push(data.aggregations.AP.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.BM.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.HC.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.KP.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.LP.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.NP.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.SG.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.SM.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.SP.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.TO.doc_count - 5);
      yesterDayoopayList.value.push(data.aggregations.TV.doc_count - 5);
		})

    //TODO axios 로 변경 ['ARS인증', '공인인증', 'fido인증', '카드비밀번호인증' ,'cvc인증', 'sms인증', '결제비밀번호인증'],
    fetch('demo/auth.json')
		.then((res) => res.json())
		.then((data) => {  
      // 오늘~지금까지
      authList.value.push(data.aggregations.AR.doc_count);
      authList.value.push(data.aggregations.CT.doc_count);
      authList.value.push(data.aggregations.FD.doc_count);
      authList.value.push(data.aggregations.HC.doc_count);
      authList.value.push(data.aggregations.MP.doc_count);
      authList.value.push(data.aggregations.PP.doc_count);
		})
}

onBeforeMount(() => {
  setColorOptions();
  getPayInfo();
  setChart();
})

</script>

<template>
  <div class="col-12 xl:col-6">
    <div class="card flex flex-column align-items-center">
        <h5 class="text-left w-full">인증 요청</h5>
        <Chart type="pie" :data="authTypes" :options="authOptions"></Chart>
    </div>
  </div>
  <div class="col-12 xl:col-6">
    <div class="card align-items-center">
        <h5 class="text-left w-full">ooPay등록</h5>
        <Chart type="bar" :data="oopayTypes" :options="oopayOptions"></Chart>
    </div>
  </div>
</template>
