<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: '채널 대시보드', icon: 'pi pi-fw pi-home', to: '/' },
                { label: '이벤트로그', icon: 'pi pi-fw pi-file', to: '/eventLog' },
                { label: '전문로그', icon: 'pi pi-fw pi-file', to: '/xmpLog' },
                { label: 'common', icon: 'pi pi-fw pi-table', to: '/common' }
               ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
