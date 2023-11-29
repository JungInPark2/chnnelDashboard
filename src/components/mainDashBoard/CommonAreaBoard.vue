<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';
import { utils } from '@/utils/utils';

const props = defineProps({
  startTime: String,
  remainingTime: String
});

const mxMainList = reactive([
   {api : '/api/lgn/cm/LGNCM010101.do', apiName : 'MX로그인', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/web/gcm/pu/GCMPU020101.do', apiName : '웰컴 패키지', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/appcard/lgn/cm/LGNCM010101.do', apiName : '앱카드 로그인', cnt : '0', yesterdayCnt:  '0' }
])

const isInvalid = ref(false);

const searchCommonAreaInfo = async (type, startDate, endDate) => {
  
  const apiList = [];
  mxMainList.forEach(obj => {
    apiList.push(obj.api);
  });

  try{
    const response = await searchMainDashBoardInfo(apiList, startDate, endDate)  
    const buckets = response.aggregations.api_name.buckets;
    for (let i = 0; i < mxMainList.length; i++) {
      for (let j = 0; j < buckets.length; j++) {
        if (buckets[j].key === mxMainList[i].api) {
          if(type === 'T') {
            mxMainList[i].cnt = buckets[j].doc_count;
          }else{  
            mxMainList[i].yesterdayCnt = buckets[j].doc_count;
          }
          
        }
      }
    }
    isInvalid.value = false;
  }catch (error) {
    isInvalid.value = true;
  }
}

const searchTempCommonAreaInfo = () => {
  if(import.meta.env.MODE === 'L') {

    fetch('demo/commonAreaData.json')
    .then((res) => res.json())
    .then((data) => {  

      const buckets = data.aggregations.api_name.buckets;

      for (let i = 0; i < mxMainList.length; i++) {
        for (let j = 0; j < buckets.length; j++) {
          if (buckets[j].key === mxMainList[i].api) {
            mxMainList[i].cnt = buckets[j].doc_count;
            mxMainList[i].yesterdayCnt = buckets[j].doc_count - 5;  //예시
          }
        }
      }
    })
  }
}

onBeforeMount(() => {
  // 오늘일시
  const { srtTimeToday, endTimeToday } = utils.getTodayTimes();
  // 전일시
  const { srtTimeYesterday, endTimeYesterday } = utils.getYesterdayTimes();

  if(import.meta.env.MODE === 'L') {
    searchTempCommonAreaInfo();
  }else{
    searchCommonAreaInfo('T' , srtTimeToday, endTimeToday);
    searchCommonAreaInfo('Y' , srtTimeYesterday, endTimeYesterday);
  }
})

defineExpose({
  searchTempCommonAreaInfo,
  searchCommonAreaInfo
});
</script>

<template>
    <div class="col-12 lg:col-6 xl:col-3" v-for="item in mxMainList" v-bind:key="item.api">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-700 font-medium mb-3">{{ item.apiName }}</span>
                    <div class="text-900 font-medium text-xl"> {{ utils.numberWithCommas(item.cnt)}}</div>
                </div>
            </div>
            <span v-if="!isInvalid" class="text-green-500 font-medium">전일자  </span>
            <span v-if="!isInvalid" class="text-500"> {{ utils.numberWithCommas(item.yesterdayCnt) }} </span>
            <span v-if="!isInvalid" class="text-yellow-500"> ({{(((item.cnt - item.yesterdayCnt) / item.yesterdayCnt) * 100).toFixed(2)}}%)</span>
            <div v-if="isInvalid" class="surface-ground  align-items-center justify-content-center  overflow-hidden">
              <div class="flex flex-column align-items-center justify-content-center">
                    <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                        <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                            <div class="grid flex flex-column align-items-center">
                                <div class="flex justify-content-center align-items-center bg-pink-500 border-circle" style="height: 3.2rem; width: 3.2rem">
                                    <i class="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                                </div>
                                <h1 class="text-900 font-bold text-5xl mb-2">Error Code {{  errorCode }}</h1>
                                <span class="text-600 mb-5">통신 중 에러가 발생 하였습니다.</span>
                                <img src="/error/asset-error.svg" alt="Error" class="mb-5" width="80%" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-700 font-medium mb-3">기준시간</span>
                    <div class="text-900 font-medium text-xl">{{ startTime }}</div>
                </div>
            </div>
            <span v-if="!isInvalid" class="text-green-500 font-medium"> {{ remainingTime }} 후 조회</span>
        </div>
    </div>

</template>
