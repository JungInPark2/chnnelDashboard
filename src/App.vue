<script setup>
 import { onMounted, ref } from 'vue';
 import { utils } from '@/utils/utils';

 onMounted(() => {
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const apiKeyValue = urlParams.get('ApiKey');

   if (apiKeyValue) {
     utils.setApiKey(apiKeyValue);
     window.history.replaceState({}, document.title, '/channel/#/');
   }

 });

</script>

<template>
    <router-view />
</template>

<style scoped></style>
