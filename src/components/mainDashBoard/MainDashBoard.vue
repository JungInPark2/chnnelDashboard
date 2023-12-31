<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MxArea1Board from '@/components/mainDashBoard/MxArea1Board.vue';
import AppCardArea1Board from '@/components/mainDashBoard/AppCardArea1Board.vue';
import CommonAreaBoard from '@/components/mainDashBoard/CommonAreaBoard.vue';
import { utils } from '@/utils/utils';

const getFormattedDate = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  
  return `${yyyy}.${mm}.${dd} (${dayOfWeek}) ${hh}:${mi}:${ss}`;
};

let startTime = ref(getFormattedDate());
let timer;
const remainingTime = ref(5 * 60); // 5분을 초로 환산
const mxArea1BoardRef = ref(null);
const commonAreaBoardRef = ref(null);
const appCardArea1BoardRef = ref(null);

const remainingMinutes = computed(() => Math.floor(remainingTime.value / 60));
const remainingSeconds = computed(() => remainingTime.value % 60);

const getRemainingTime = () => {
  return `${remainingMinutes.value}분 ${remainingSeconds.value}초`;
};

const restartTimer = () => {
  remainingTime.value = 5 * 60; // 5분으로 다시 설정
};

const updateRemainingTime = () => {
  if (remainingTime.value > 0) {
    remainingTime.value -= 1;
  }else{
    startTime.value = getFormattedDate(); // 기준시간 업데이트

    const { srtTimeYesterday, endTimeYesterday } = utils.getYesterdayTimes();
    const { srtTimeToday, endTimeToday } = utils.getTodayTimes();

    if(commonAreaBoardRef.value){
      if(import.meta.env.MODE === 'L') {
        commonAreaBoardRef.value.searchTempCommonAreaInfo();
      }else{
        commonAreaBoardRef.value.searchCommonAreaInfo('T' , srtTimeToday, endTimeToday);
        commonAreaBoardRef.value.searchCommonAreaInfo('Y' , srtTimeYesterday, endTimeYesterday);
      }
    }

    if(mxArea1BoardRef.value){
      mxArea1BoardRef.value.getLtmCardLoan();
      mxArea1BoardRef.value.getShtrCardLoan();
    }
    
    if(appCardArea1BoardRef.value){
      if(import.meta.env.MODE === 'L') {
        appCardArea1BoardRef.value.getTempInfo();
      }else{
        // 앱카드 인증요청
        appCardArea1BoardRef.value.getAuthInfo( srtTimeToday, endTimeToday);
        // oopay등록 어제,오늘
        appCardArea1BoardRef.value.getAppCardInfo('T',  srtTimeToday, endTimeToday);
        appCardArea1BoardRef.value.getAppCardInfo('Y', srtTimeYesterday, endTimeYesterday);
      }
    }

    restartTimer(); // 타이머 재시작
  }
};

onMounted(() => {
  timer = setInterval(updateRemainingTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

</script>

<template>
    <div class="grid">
      <common-area-board ref="commonAreaBoardRef" :startTime="startTime" :remaining-time="getRemainingTime()"></common-area-board>
      <mx-area-1-board ref="mxArea1BoardRef"></mx-area-1-board>
      <app-card-area-1-board ref="appCardArea1BoardRef"></app-card-area-1-board>
  </div>
</template>
