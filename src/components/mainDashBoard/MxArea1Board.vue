<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';

// 장기카드대출
const bfdtLtmCardLoan = ref({});
const bfdtLtmCardLoanCount = reactive({});
const todyLtmCardLoan = ref({});
const todyLtmCardLoanCount = reactive({});
const todyLtmCardLoanRto = reactive({});

// 단기카드대출
const bfdtShtrCardLoan = ref({});
const bfdtShtrCardLoanCount = reactive({});
const todyShtrCardLoan = ref({});
const todyShtrCardLoanCount = reactive({});
const todyShtrCardLoanRto = reactive({});

// 오류처리 변수
const isErrorLtmCardLoan = ref(false);
const errorMessageLtmCardLoan = ref('');
const isErrorShtrCardLoan = ref(false);
const errorMessageShtrCardLoan = ref('');

onBeforeMount(() => {
    getLtmCardLoan();   // 장기카드대출
    getShtrCardLoan();  // 단기카드대출
})

// 장기카드대출
const getLtmCardLoan = async () => {

    const apiNames = ['/web/fin/ll/FINLL010103.do','/web/fin/ll/FINLL020103.do','/web/fin/ll/FINLL020203.do','/web/fin/ll/FINLL020901.do','/web/fin/ll/FINLL020401.do','/web/fin/ll/FINLL020801.do','/web/fin/ll/FINLL020501.do'];

    // 전일자 00시부터 전일자 23시 59분 59초까지
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const srtTimeYesterday = new Date(yesterday).setHours(0, 0, 0, 0);
    const endTimeYesterday = new Date(yesterday).setHours(23, 59, 59, 999);

    try{
        const searchBfdtLtmCardLoan = await searchMainDashBoardInfo(apiNames, new Date(srtTimeYesterday).toISOString(), new Date(endTimeYesterday).toISOString())
        bfdtLtmCardLoan.value = searchBfdtLtmCardLoan;

        apiNames.forEach(apiName => {
            bfdtLtmCardLoanCount[apiName] = getDocCount(searchBfdtLtmCardLoan, apiName);
        });
    }catch(error){
        isErrorLtmCardLoan.value = true;
        if (error.message) {
            errorMessageLtmCardLoan.value = error.message + '<br>API 호출 중 오류가 발생했습니다.';
        } else {
            errorMessageLtmCardLoan.value = 'API 호출 중 오류가 발생했습니다.';
        }
    }

    // 오늘 00시부터 오늘 현재시간까지
    const now = new Date();
    const srtTimeToday = new Date(now).setHours(0, 0, 0, 0);
    const endTimeToday = now.toISOString();

    try{
        const searchTodyLtmCardLoan = await searchMainDashBoardInfo(apiNames, new Date(srtTimeToday).toISOString(), endTimeToday);
        todyLtmCardLoan.value = searchTodyLtmCardLoan;

        apiNames.forEach(apiName => {
            todyLtmCardLoanCount[apiName] = getDocCount(searchTodyLtmCardLoan, apiName);
            todyLtmCardLoanRto[apiName] = getLtmCardLoanRto(todyLtmCardLoanCount[apiName]);
        });
    }catch(error){
        isErrorLtmCardLoan.value = true;
        if (error.message) {
            errorMessageLtmCardLoan.value = error.message + '<br>API 호출 중 오류가 발생했습니다.';
        } else {
            errorMessageLtmCardLoan.value = 'API 호출 중 오류가 발생했습니다.';
        }
    }
}

// 단기카드대출
const getShtrCardLoan = async () => {


    const apiNames = ['/web/fin/sl/FINSL010101.do','/web/fin/sl/FINSL020101.do','/web/fin/sl/FINSL090101.do','/web/fin/sl/FINSL100102.do','/web/fin/at/FINAT020101.do','/web/fin/sl/FINSL040101.do'];

    // 전일자 00시부터 전일자 23시 59분 59초까지
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const srtTimeYesterday = new Date(yesterday).setHours(0, 0, 0, 0);
    const endTimeYesterday = new Date(yesterday).setHours(23, 59, 59, 999);

    try{
        const searchBfdtShtrCardLoan = await searchMainDashBoardInfo(apiNames, new Date(srtTimeYesterday).toISOString(), new Date(endTimeYesterday).toISOString())
        bfdtShtrCardLoan.value = searchBfdtShtrCardLoan;

        apiNames.forEach(apiName => {
            bfdtShtrCardLoanCount[apiName] = getDocCount(searchBfdtShtrCardLoan, apiName);
        });
    }catch(error){
        isErrorShtrCardLoan.value = true;
        if (error.message) {
            errorMessageShtrCardLoan.value = error.message + '<br>API 호출 중 오류가 발생했습니다.';
        } else {
            errorMessageShtrCardLoan.value = 'API 호출 중 오류가 발생했습니다.';
        }
    }

    // 오늘 00시부터 오늘 현재시간까지
    const now = new Date();
    const srtTimeToday = new Date(now).setHours(0, 0, 0, 0);
    const endTimeToday = now.toISOString();

    try{
        const searchTodyShtrCardLoan = await searchMainDashBoardInfo(apiNames, new Date(srtTimeToday).toISOString(), endTimeToday);
        todyShtrCardLoan.value = searchTodyShtrCardLoan;

        apiNames.forEach(apiName => {
            todyShtrCardLoanCount[apiName] = getDocCount(searchTodyShtrCardLoan, apiName);
            todyShtrCardLoanRto[apiName] = getShtrCardLoanRto(todyShtrCardLoanCount[apiName]);
        });
    }catch(error){
        isErrorShtrCardLoan.value = true;
        if (error.message) {
            errorMessageShtrCardLoan.value = error.message + '<br>API 호출 중 오류가 발생했습니다.';
        } else {
            errorMessageShtrCardLoan.value = 'API 호출 중 오류가 발생했습니다.';
        }
    }
}

const getDocCount = (data, targetKey) => {
    const buckets = data.aggregations.api_name.buckets;
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i].key.includes(targetKey)) {
            return buckets[i].doc_count;
        }
    }
    return 0;
}

const getLtmCardLoanRto = (count) => {
    if (todyLtmCardLoan.value && todyLtmCardLoan.value.hits && todyLtmCardLoan.value.hits.total.value > 0) {
        return (count / todyLtmCardLoan.value.hits.total.value) * 100;
    }
    return 0;
};

const getShtrCardLoanRto = (count) => {
    if (todyShtrCardLoan.value && todyShtrCardLoan.value.hits && todyShtrCardLoan.value.hits.total.value > 0) {
        return (count / todyShtrCardLoan.value.hits.total.value) * 100;
    }
    return 0;
};

</script>

<template>
    <div class="col-12 xl:col-6">
        <div v-if="isErrorLtmCardLoan" class="card">
            <div class="flex justify-content-between align-items-center mb-5">
                <h5>장기카드대출</h5>
            </div>
            <div class="p-error" v-html="errorMessageLtmCardLoan"></div>
        </div>
        <div v-if="!isErrorLtmCardLoan" class="card">
            <div class="flex justify-content-between align-items-center mb-5">
                <h5>장기카드대출</h5>
            </div>
            <ul class="list-none p-0 m-0">
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">가능 여부 조회</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-orange-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL010103.do'] + '%' }"></div>
                            </div>
                            <span class="text-orange-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL010103.do'] }}</span>
                        </div> 
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL010103.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">정보 조회 Step1</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-cyan-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL020103.do'] + '%' }"></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL020103.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL020103.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">정보 조회 Step2 (DSR한도 조회)</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-yellow-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL020203.do'] + '%' }"></div>
                            </div>
                            <span class="text-yellow-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL020203.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL020203.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">적합성 등록</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-green-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL020901.do'] + '%' }"></div>
                            </div>
                            <span class="text-green-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL020901.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL020901.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">신청접수확인</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-purple-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL020401.do'] + '%' }"></div>
                            </div>
                            <span class="text-purple-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL020401.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL020401.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">대출상품설명서 LMS발송</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-teal-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL020801.do'] + '%' }"></div>
                            </div>
                            <span class="text-teal-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL020801.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL020801.do'] }}</span>
                        </div>
                    </div>
                </li>

                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">신청 완료</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-pink-500 h-full" :style="{ width: todyLtmCardLoanRto['/web/fin/ll/FINLL020501.do'] + '%' }"></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium">{{ todyLtmCardLoanCount['/web/fin/ll/FINLL020501.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtLtmCardLoanCount['/web/fin/ll/FINLL020501.do'] }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div class="col-12 xl:col-6">

        <div v-if="isErrorShtrCardLoan" class="card">
            <div class="flex justify-content-between align-items-center mb-5">
                <h5>단기카드대출</h5>
            </div>
            <div class="p-error" v-html="errorMessageShtrCardLoan"></div>
        </div>

        <div v-if="!isErrorShtrCardLoan"  class="card">
            <div class="flex justify-content-between align-items-center mb-5">
                <h5>단기카드대출</h5>
            </div>
            <ul class="list-none p-0 m-0">
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">가능 여부 조회</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-orange-500 h-full" :style="{ width: todyShtrCardLoanRto['/web/fin/sl/FINSL010101.do'] + '%' }"></div>
                            </div>
                            <span class="text-orange-500 ml-3 font-medium">{{ todyShtrCardLoanCount['/web/fin/sl/FINSL010101.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtShtrCardLoanCount['/web/fin/sl/FINSL010101.do'] }}</span>
                        </div>
                    </div>
                </li>
                
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">정보 조회</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-cyan-500 h-full" :style="{ width: todyShtrCardLoanRto['/web/fin/sl/FINSL020101.do'] + '%' }"></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium">{{ todyShtrCardLoanCount['/web/fin/sl/FINSL020101.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtShtrCardLoanCount['/web/fin/sl/FINSL020101.do'] }}</span>
                        </div>
                    </div>
                </li>

                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">신청정보 확인</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-yellow-500 h-full" :style="{ width: todyShtrCardLoanRto['/web/fin/sl/FINSL090101.do'] + '%' }"></div>
                            </div>
                            <span class="text-yellow-500 ml-3 font-medium">{{ todyShtrCardLoanCount['/web/fin/sl/FINSL090101.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtShtrCardLoanCount['/web/fin/sl/FINSL090101.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">이자율 및 결제예정일 조회</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-green-500 h-full" :style="{ width: todyShtrCardLoanRto['/web/fin/sl/FINSL100102.do'] + '%' }"></div>
                            </div>
                            <span class="text-green-500 ml-3 font-medium">{{ todyShtrCardLoanCount['/web/fin/sl/FINSL100102.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtShtrCardLoanCount['/web/fin/sl/FINSL100102.do'] }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">금융ATM 입금지연시간 여부 조회</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-teal-500 h-full" :style="{ width: todyShtrCardLoanRto['/web/fin/at/FINAT020101.do'] + '%' }"></div>
                            </div>
                            <span class="text-teal-500 ml-3 font-medium">{{ todyShtrCardLoanCount['/web/fin/at/FINAT020101.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtShtrCardLoanCount['/web/fin/at/FINAT020101.do'] }}</span>
                        </div>
                    </div>
                </li>

                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0">신청 완료</span>
                        <div class="mt-1 text-600">전일자 건수</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5" style="height: 8px; box-sizing: border-box;">
                                <div class="bg-pink-500 h-full" :style="{ width: todyShtrCardLoanRto['/web/fin/sl/FINSL040101.do'] + '%' }"></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium">{{ todyShtrCardLoanCount['/web/fin/sl/FINSL040101.do'] }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ bfdtShtrCardLoanCount['/web/fin/sl/FINSL040101.do'] }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

