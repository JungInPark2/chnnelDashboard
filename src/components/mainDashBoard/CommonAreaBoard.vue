<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';

const mxMainList = reactive([
   {api : '/web/gcm/pu/GCMPU020101.do', apiName : '웰컴패키지', cnt : '0' }
  ,{api : '/api/lgn/cm/LGNCM010101.do', apiName : 'MX로그인', cnt : '0' }
  ,{api : '/api/appcard/lgn/cm/LGNCM010101.do', apiName : '앱카드로그인', cnt : '0' }
])

const tileList = reactive([]);

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
          }
        }
      }
    })
  }
}

const searchCommonAreaInfo = async () => {

  const apiList = [];
  mxMainList.forEach(obj => {
    apiList.push(obj.api);
  });

  const srtTimeToday = new Date(new Date()).setHours(0, 0, 0, 0);
  const endTimeYesterday = new Date(new Date()).setHours(23, 59, 59, 999);

  const result = await searchMainDashBoardInfo(apiList, new Date(srtTimeToday).toISOString(), new Date(endTimeYesterday).toISOString())

  const buckets = result.aggregations.api_name.buckets;

  for (let i = 0; i < mxMainList.length; i++) {
    for (let j = 0; j < buckets.length; j++) {
      if (buckets[j].key === mxMainList[i].api) {
        mxMainList[i].cnt = buckets[j].doc_count;
      }
    }
  }
}

onBeforeMount(() => {
  if(import.meta.env.MODE === 'L' || import.meta.env.MODE === 'D') {
    searchTempCommonAreaInfo();
  }else{
    searchCommonAreaInfo();
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
                <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-search text-blue-500 text-xl"></i>
                </div>
            </div>
            <span class="text-green-500 font-medium">하루 전</span>
            <span class="text-500"> ...</span>
        </div>
    </div>
</template>
