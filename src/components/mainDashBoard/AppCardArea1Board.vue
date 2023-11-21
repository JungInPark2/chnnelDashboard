<script setup>
import { onBeforeMount, ref, reactive, defineExpose } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';
import { utils } from '@/utils/utils';

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const authTypes = ref({});
const authOptions = ref({});
const authList = ref([]);
const oopayTypes = ref({});
const oopayOptions = ref({});

const isPayInvalid = ref(false);
const isAuthInvalid = ref(false);

const authOrderList = reactive([
   {api : '/api/appcard/aut/ar/AUTAR010201.do', apiName : 'ARS인증', cnt : '0'}
  ,{api : '/api/appcard/aut/ct/AUTCT010101.do', apiName : '공인인증', cnt : '0'}
  ,{api : '/api/appcard/aut/fd/AUTFD010201.do', apiName : 'fido인증', cnt : '0' }
  ,{api : '/api/appcard/aut/hc/AUTHC010101.do', apiName : '카드비밀번호인증', cnt : '0'}
  ,{api : '/api/appcard/aut/mp/AUTMP010201.do', apiName : 'sms인증', cnt : '0'}
  ,{api : '/api/appcard/aut/pp/AUTPP010101.do', apiName : '결제비밀번호인증', cnt : '0'}
])

const oopayOrderList = reactive([
   {api : '/api/appcard/prs/ap/PRSAP010201.do', apiName : 'Apple pay', cnt : '0', yesterdayCnt : '0' }
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
  let authOrderNameList = [];
  let authList = [];
  authOrderList.forEach(obj => {
    authList.push(obj.cnt);
    authOrderNameList.push(obj.apiName);
  });

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

  authTypes.value = {
    labels: authOrderNameList,
    datasets: [
        {
            data: authList,
            backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--primary-500'), documentStyle.getPropertyValue('--green-500'), 
            documentStyle.getPropertyValue('--pink-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--yellow-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--primary-400'), documentStyle.getPropertyValue('--green-400'), 
            documentStyle.getPropertyValue('--pink-400'), documentStyle.getPropertyValue('--teal-400'), documentStyle.getPropertyValue('--yellow-400')]
        }
    ]
  };

}

const setOOPayChart = () => {
  
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

    let oopayOrderNameList = [];
    let yesterDayoopayList = [];
    let oopayList = [];
    oopayOrderList.forEach(obj => {
      oopayList.push(obj.cnt);
      yesterDayoopayList.push(obj.yesterdayCnt);
      oopayOrderNameList.push(obj.apiName);
    });

    //['Apple pay', '배민페이', 'carPay', '카카오페이', 'L.PAY', '네이버', '네이버인입', 'SSG', '스마일페이', '삼성페이', '토스페이', 'TV페이']
    oopayTypes.value = {
        labels: oopayOrderNameList,
        datasets: [
            {
                label: '전일자',
                backgroundColor: documentStyle.getPropertyValue('--pink-200'),
                borderColor: documentStyle.getPropertyValue('--pink-200'),
                data: yesterDayoopayList
            },
            {
                label: '오늘',
                backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                borderColor: documentStyle.getPropertyValue('--pink-500'),
                data: oopayList
            }
        ]
    };

}

const getAppCardInfo = async (type, startDate, endDate) => {

  try{
    const result = await searchMainDashBoardInfo(oopayOrderList, startDate, endDate);
    const buckets = result.aggregations.api_name.buckets;

    for (let i = 0; i < oopayOrderList.length; i++) {
      for (let j = 0; j < buckets.length; j++) {
        if (buckets[j].key === oopayOrderList[i].api) {
          if(type === 'T') {
            oopayOrderList[i].cnt = buckets[j].doc_count;
          }else{
            oopayOrderList[i].yesterdayCnt = buckets[j].doc_count;
          }
        }
      }
    }
    isPayInvalid.value = false;
  }catch(error){
    isPayInvalid.value = true;
    console.log(error);
  }
  
}

const getAuthInfo = async (startDate, endDate) => {
 
  try{
    const result = await searchMainDashBoardInfo(authOrderList, startDate, endDate);
    const buckets = result.aggregations.api_name.buckets;

    for (let i = 0; i < authOrderList.length; i++) {
      for (let j = 0; j < buckets.length; j++) {
        if (buckets[j].key === authOrderList[i].api) {
            authOrderList[i].cnt = buckets[j].doc_count;
        }
      }
    }

    // 차트가 안그려진다면 데이터 세팅하고 호출하는 방법 찾기 
    setAuthChart();
    isAuthInvalid.value = false;
  }catch(error){
    isAuthInvalid.value = true;
    console.log(error);
  }
}

onBeforeMount(() => {
  const now = new Date();
  const srtTimeToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const endTimeToday = utils.toISOStringWithLocalOffset(now);

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const srtTimeYesterday = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()));
  const endTimeYesterday = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 23, 59, 59, 999));

  setColorOptions();
  if(import.meta.env.MODE === 'L') {
    getTempInfo();
  }else{
    // 앱카드 인증요청
    getAuthInfo(new Date(srtTimeToday).toISOString(), endTimeToday);
    // oopay등록 어제,오늘
    getAppCardInfo('T', new Date(srtTimeToday).toISOString(), endTimeToday)
      .then(() => {
          getAppCardInfo('Y', srtTimeYesterday.toISOString(), endTimeYesterday.toISOString());
      }).then(() => {
        setOOPayChart();
      }).catch((error) => {
        console.error("Error:", error);
      })
  }
})

defineExpose({
  getTempInfo,
  getAuthInfo,
  getAppCardInfo
});

</script>

<template>
  <div class="col-12 xl:col-6">
    <div class="card flex flex-column align-items-center">
        <h5 class="text-left w-full">앱카드 인증 요청</h5>
        <Chart v-if="!isAuthInvalid"  type="pie" :data="authTypes" :options="authOptions"></Chart>
          <div v-if="isAuthInvalid" class=" align-items-center justify-content-center  overflow-hidden">
            <div class="flex flex-column align-items-center justify-content-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                        <div class="grid flex flex-column align-items-center">
                            <div class="flex justify-content-center align-items-center bg-pink-500 border-circle" style="height: 3.2rem; width: 3.2rem">
                                <i class="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                            </div>
                            <h1 class="text-900 font-bold text-5xl mb-2">Error Code </h1>
                            <span class="text-600 mb-5">통신 중 에러가 발생 하였습니다.</span>
                            <img src="/error/asset-error.svg" alt="Error" class="mb-5" width="80%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <div class="col-12 xl:col-6">
    <div class="card align-items-center">
        <h5 class="text-left w-full">ooPay 등록 요청</h5>
        <Chart v-if="!isPayInvalid" type="bar" :data="oopayTypes" :options="oopayOptions"></Chart>
        <div v-if="isPayInvalid" class="align-items-center justify-content-center  overflow-hidden">
          <div class="flex flex-column align-items-center justify-content-center">
              <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                  <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                      <div class="grid flex flex-column align-items-center">
                          <div class="flex justify-content-center align-items-center bg-pink-500 border-circle" style="height: 3.2rem; width: 3.2rem">
                              <i class="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                          </div>
                          <h1 class="text-900 font-bold text-5xl mb-2">Error Code </h1>
                          <span class="text-600 mb-5">통신 중 에러가 발생 하였습니다.</span>
                          <img src="/error/asset-error.svg" alt="Error" class="mb-5" width="80%" />
                      </div>
                  </div>
              </div>
          </div>
        </div>
    </div>
  </div>
</template>
