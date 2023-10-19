<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';

const mxMainList = reactive([
   {api : '/web/gcm/pu/GCMPU020101.do', apiName : '웰컴 패키지', cnt : '', yesterdayCnt : '' }
  ,{api : '/api/lgn/cm/LGNCM010101.do', apiName : 'MX로그인', cnt : '', yesterdayCnt : '' }
  ,{api : '/api/appcard/lgn/cm/LGNCM010101.do', apiName : '앱카드 로그인', cnt : '', yesterdayCnt:  '' }
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
  const now = new Date();
  const srtTimeToday = new Date(now).setHours(0, 0, 0, 0);
  const endTimeToday = now.toISOString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const srtTimeYesterday = new Date(yesterday).setHours(0, 0, 0, 0);
  const endTimeYesterday = new Date(yesterday).setHours(23, 59, 59, 999);

  if(import.meta.env.MODE === 'L') {
    searchTempCommonAreaInfo();
  }else{
    searchCommonAreaInfo('T' , new Date(srtTimeToday).toISOString(), endTimeToday);
    searchCommonAreaInfo('Y' , new Date(srtTimeYesterday).toISOString(), new Date(endTimeYesterday).toISOString());
  }
})
</script>

<template>
    <div class="col-12 lg:col-6 xl:col-3" v-for="item in mxMainList" v-bind:key="item.api">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-500 font-medium mb-3">{{ item.apiName }}</span>
                    <div class="text-900 font-medium text-xl">{{ item.cnt }}</div>
                </div>
            </div>
            <span v-if="!isInvalid" class="text-green-500 font-medium">하루 전  </span>
            <span v-if="!isInvalid" class="text-500"> {{ item.yesterdayCnt }} </span>
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
  
</template>