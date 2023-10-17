<script setup>
import { onBeforeMount, ref, reactive } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';

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
const authOrderList = reactive([
   {api : '/api/appcard/auth/ar/AUTAR010201.do', apiName : 'ARS인증', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/appcard/auth/ct/AUTCT010101.do', apiName : '공인인증', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/appcard/auth/fd/AUTFD010201.do', apiName : 'fido인증', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/auth/hc/AUTHC010101.do', apiName : '카드비밀번호인증', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/auth/mp/AUTMP010201.do', apiName : 'sms인증', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/auth/pp/AUTPP010101.do', apiName : '결제비밀번호인증', cnt : '0', yesterdayCnt:  '0' }
])
const oopayOrderList = reactive([
   {api : '/api/appcard/prs/ap/PRSAP010201.do', apiName : 'ARS인증', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/appcard/prs/bm/PRSBM010201.do', apiName : '배민페이', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/appcard/prs/hc/PRSHC010201.do', apiName : 'carPay', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/kp/PRSKP020101.do', apiName : '카카오페이', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/lp/PRSLP010201.do', apiName : 'L.PAY', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/np/PRSNP020101.do', apiName : '네이버', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/np/PRSNP020201.do', apiName : '네이버인입', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/sg/PRSSG010201.do', apiName : 'SSG', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/sp/PRSSP020101.do', apiName : '스마일페이', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/sm/PRSSM010201.do', apiName : '삼성페이', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/st/PRSTO010201.do', apiName : '토스페이', cnt : '0', yesterdayCnt:  '0' }
  ,{api : '/api/appcard/prs/tv/PRSTV010201.do', apiName : 'TV페이', cnt : '0', yesterdayCnt:  '0' }
])

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const getTempInfo = () => {
    fetch('demo/oopay.json')
		.then((res) => res.json())
		.then((data) => {  
      const buckets = data.aggregations.api_name.buckets;
      for (let i = 0; i < oopayOrderList.length; i++) {
        for (let j = 0; j < buckets.length; j++) {
          if (buckets[j].key === oopayOrderList[i].api) {
            oopayOrderList[i].cnt = buckets[j].doc_count;
          }
        }
      }
      setOOPayChart();
  })
    fetch('demo/auth.json')
    .then((res) => res.json())
    .then((data) => {  
      const buckets = data.aggregations.api_name.buckets;
      for (let i = 0; i < authOrderList.length; i++) {
        for (let j = 0; j < buckets.length; j++) {
          if (buckets[j].key === authOrderList[i].api) {
            authOrderList[i].cnt = buckets[j].doc_count;
          }
        }
      }
      setAuthChart();
    })
}

const setAuthChart = () => {
  authOrderList.forEach(obj => {
    authList.value.push(obj.cnt);
  });

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
}

const setOOPayChart = () => {
  oopayOrderList.forEach(obj => {
    oopayList.value.push(obj.cnt);
    yesterDayoopayList.value.push(obj.yesterdayCnt);
  });

  oopayTypes.value = {
      labels: ['Apple pay', '배민페이', 'carPay', '카카오페이', 'L.PAY', '네이버', '네이버인입', 'SSG', '스마일페이', '삼성페이', '토스페이', 'TV페이'],
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

const getAppCardInfo = async (type, startDate, endDate) => {
  
  console.log(startDate.toISOString(), endDate.toISOString());

  const apiList = [];
  authOrderList.forEach(obj => {
    apiList.push(obj.api);
  });
  oopayOrderList.forEach(obj => {
    apiList.push(obj.api);
  });

  const result = await searchMainDashBoardInfo(apiList, startDate.toISOString(), endDate.toISOString());
  const buckets = result.aggregations.api_name.buckets;

  for (let i = 0; i < authOrderList.length; i++) {
    for (let j = 0; j < buckets.length; j++) {
      if (buckets[j].key === authOrderList[i].api) {
          authOrderList[i].cnt = buckets[j].doc_count;
      }
    }
  }
  for (let i = 0; i < oopayOrderList.length; i++) {
    for (let j = 0; j < buckets.length; j++) {
      if (buckets[j].key === oopayOrderList[i].api) {
        oopayOrderList[i].cnt = buckets[j].doc_count;
        if(type === 'Y') {
          oopayOrderList[i].yesterdayCnt = buckets[j].doc_count;
        }
      }
    }
  }

  // 차트가 안그려진다면 데이터 세팅하고 호출하는 방법 찾기 
  setAuthChart();
  setOOPayChart();
}

onBeforeMount(() => {
  var today = new Date();
  var yesterday = new Date(today);

  setColorOptions();
  if(import.meta.env.MODE === 'L' || import.meta.env.MODE === 'D') {
    getTempInfo();
  }else{
    getAppCardInfo('T', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), new Date());
    getAppCardInfo('Y', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), new Date());
  }
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
