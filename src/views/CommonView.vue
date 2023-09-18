<script>
import { ref } from 'vue';
import { postEventLog, getEventLog } from '@/api/EventLog';
import { searchChannelDashboardInfo } from '@/api/Main';

const dashboardInfoYesterday1 = ref({});
const dashboardInfoToday1 = ref({});

export default {
  data() {
    return { 'name': 'value' }
  },
  methods: {
    async postData() {
      try {
          // 비즈니스 로직
          const userData = {};
          const { data } = await getEventLog('');
          // data 바운딩
      } catch (error) {
          // 에러 핸들링할 코드
          console.log(error.response);
      } finally {
          
      }
    },
    async getInfo() {
      try {
          // 비즈니스 로직
          const apiNames = ['/web/fin/pu/FINPU010101.do', '/web/fin/mn/FINMN010101.do', '/api/appcard/gcm/ka/GCMKA010101.do'];

          // 전일자 00시부터 전일자 현재시간까지
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const gteTimeYesterday = new Date(yesterday).setHours(0, 0, 0, 0);
          const lteTimeYesterday = new Date(yesterday).setHours(yesterday.getHours(), yesterday.getMinutes(), yesterday.getSeconds(), 999);

          const dashboardInfoYesterday = await searchChannelDashboardInfo(apiNames, new Date(gteTimeYesterday).toISOString(), new Date(lteTimeYesterday).toISOString());
          console.log('Yesterday:', dashboardInfoYesterday);

          // 오늘 00시부터 오늘 현재시간까지
          const now = new Date();
          const gteTimeToday = new Date(now).setHours(0, 0, 0, 0);
          const lteTimeToday = now.toISOString();

          const dashboardInfoToday = await searchChannelDashboardInfo(apiNames, new Date(gteTimeToday).toISOString(), lteTimeToday);
          console.log('Today:', dashboardInfoToday);

          dashboardInfoYesterday1.value = dashboardInfoYesterday;
          dashboardInfoToday1.value = dashboardInfoToday;

      } catch (error) {
          // 에러 핸들링할 코드
          console.log(error.response);
      } finally {
          
      }
    }
  },
  created() {
    console.log('created()');

  }
};

</script>

<template>
  <div class='grid'>
    <button v-on:click='postData'>get data</button>
    <button v-on:click='getInfo'>Test</button>
  </div>
</template>
