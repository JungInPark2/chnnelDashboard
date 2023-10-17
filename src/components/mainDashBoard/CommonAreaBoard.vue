<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';

const mxMainList = reactive([
   {api : '/web/gcm/pu/GCMPU020101.do', apiName : '웰컴 패키지', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/lgn/cm/LGNCM010101.do', apiName : 'MX로그인', cnt : '0', yesterdayCnt : '0' }
  ,{api : '/api/appcard/lgn/cm/LGNCM010101.do', apiName : '앱카드 로그인', cnt : '0', yesterdayCnt:  '0' }
])

const searchTempCommonAreaInfo = () => {
  if(import.meta.env.MODE === 'L' || import.meta.env.MODE === 'D') {

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

const searchCommonAreaInfo = async (type, startDate, endDate) => {
  
  console.log(startDate.toISOString(), endDate.toISOString());

  const apiList = [];
  mxMainList.forEach(obj => {
    apiList.push(obj.api);
  });

  const result = await searchMainDashBoardInfo(apiList, startDate.toISOString(), endDate.toISOString());
  const buckets = result.aggregations.api_name.buckets;

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
}

onBeforeMount(() => {
  var today = new Date();
  var yesterday = new Date(today);

  if(import.meta.env.MODE === 'L' || import.meta.env.MODE === 'D') {
    searchTempCommonAreaInfo();
  }else{
    searchCommonAreaInfo('T' , new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), new Date());
    searchCommonAreaInfo('Y' , new Date(yesterday.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), new Date(yesterday).setHours(23, 59, 59, 999));
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
            <span class="text-green-500 font-medium">하루 전  </span>
            <span class="text-500"> {{ item.yesterdayCnt }} </span>
        </div>
    </div>
</template>
