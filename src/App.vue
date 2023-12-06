<script setup>
 import { onMounted } from 'vue';
 import { utils } from '@/utils/utils';
 import router from './router'

 onMounted(() => {
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const apiKeyValue = urlParams.get('ApiKey');

   if (apiKeyValue) {
     utils.setApiKey(apiKeyValue);
     window.history.replaceState({}, document.title, '/channel/index.html#/');
   }else{
     router.push('/error')
   }

 });

</script>

<template>
    <router-view />
</template>

<style scoped></style>
