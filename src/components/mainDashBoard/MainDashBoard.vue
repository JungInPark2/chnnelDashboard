<script setup>
import MxArea1Board from '@/components/MainDashBoard/MxArea1Board.vue';
import AppCardArea1Board from '@/components/MainDashBoard/AppCardArea1Board.vue';

// mxArea1Board , appCardAre1 에 넘길 동일한 데이터는 props 로 넘기기
</script>

<template>
    <div class="grid">
      <mx-area-1-board></mx-area-1-board>
      <app-card-area-1-board></app-card-area-1-board>
  </div>
</template>
