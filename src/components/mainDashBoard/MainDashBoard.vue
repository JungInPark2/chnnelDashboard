<script setup>
import MxArea1Board from '@/components/mainDashBoard/MxArea1Board.vue';
import AppCardArea1Board from '@/components/mainDashBoard/AppCardArea1Board.vue';
import CommonAreaBoard from '@/components/mainDashBoard/CommonAreaBoard.vue';

// mxArea1Board , appCardAre1 에 넘길 동일한 데이터는 props 로 넘기기
</script>

<template>
    <div class="grid">
      <common-area-board></common-area-board>
      <mx-area-1-board></mx-area-1-board>
      <app-card-area-1-board></app-card-area-1-board>
  </div>
</template>
