<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { searchMainDashBoardInfo } from '@/api/MainDashBoard';
import { utils } from '@/utils/utils';

// 장기카드대출
const bfdtLtmCardLoan = ref({});
const bfdtLtmCardLoanCount = reactive({});
const todyLtmCardLoan = ref({});
const todyLtmCardLoanCount = reactive({});
const todyLtmCardLoanRto = reactive({});
let todyLtmCardLoanTotalCount = 0;

// 단기카드대출
const bfdtShtrCardLoan = ref({});
const bfdtShtrCardLoanCount = reactive({});
const todyShtrCardLoan = ref({});
const todyShtrCardLoanCount = reactive({});
const todyShtrCardLoanRto = reactive({});
let todyShtrCardLoanTotalCount = 0;

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

    // 전일자 시간 구하기
    const { srtTimeYesterday, endTimeYesterday } = utils.getYesterdayTimes();

    try{
        isErrorLtmCardLoan.value = false;
        const searchBfdtLtmCardLoan = await searchMainDashBoardInfo(apiNames, srtTimeYesterday, endTimeYesterday)
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

    // 오늘자 시간 구하기
    const { srtTimeToday, endTimeToday } = utils.getTodayTimes();

    try{
        isErrorLtmCardLoan.value = false;
        const searchTodyLtmCardLoan = await searchMainDashBoardInfo(apiNames, srtTimeToday, endTimeToday);
        todyLtmCardLoan.value = searchTodyLtmCardLoan;

        // 오늘자 단계별 count 및 total count 값을 구함
        apiNames.forEach(apiName => {
            todyLtmCardLoanCount[apiName] = getDocCount(searchTodyLtmCardLoan, apiName);
            todyLtmCardLoanTotalCount = todyLtmCardLoanTotalCount + todyLtmCardLoanCount[apiName];
        });

        // 단계별 %을 구함
        apiNames.forEach(apiName => {
            todyLtmCardLoanRto[apiName] = getLtmCardLoanRto(todyLtmCardLoanCount[apiName], todyLtmCardLoanTotalCount);
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

    // 전일자 시간 구하기
    const { srtTimeYesterday, endTimeYesterday } = utils.getYesterdayTimes();

    try{
        isErrorShtrCardLoan.value = false;
        const searchBfdtShtrCardLoan = await searchMainDashBoardInfo(apiNames, srtTimeYesterday, endTimeYesterday)
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

    // 오늘자 시간 구하기
    const { srtTimeToday, endTimeToday } = utils.getTodayTimes();

    try{
        isErrorShtrCardLoan.value = false;
        const searchTodyShtrCardLoan = await searchMainDashBoardInfo(apiNames, srtTimeToday, endTimeToday);
        todyShtrCardLoan.value = searchTodyShtrCardLoan;

        // 오늘자 단계별 count 및 total count 값을 구함
        apiNames.forEach(apiName => {
            todyShtrCardLoanCount[apiName] = getDocCount(searchTodyShtrCardLoan, apiName);
            todyShtrCardLoanTotalCount = todyShtrCardLoanTotalCount + todyShtrCardLoanCount[apiName];
        });

        // 단계별 %을 구함
        apiNames.forEach(apiName => {
            todyShtrCardLoanRto[apiName] = getShtrCardLoanRto(todyShtrCardLoanCount[apiName], todyShtrCardLoanTotalCount);
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

const getLtmCardLoanRto = (count, todyLtmCardLoanTotalCount) => {
    if (todyLtmCardLoanTotalCount > 0) {
        return (count / todyLtmCardLoanTotalCount) * 100;
    }
    return 0;
};

const getShtrCardLoanRto = (count, todyShtrCardLoanTotalCount) => {
    if (todyShtrCardLoanTotalCount > 0) {
        return (count / todyShtrCardLoanTotalCount) * 100;
    }
    return 0;
};

defineExpose({
  getLtmCardLoan,
  getShtrCardLoan
});

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
                            <span class="text-orange-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL010103.do']) }}</span>
                        </div> 
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL010103.do']) }}</span>
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
                            <span class="text-cyan-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL020103.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL020103.do']) }}</span>
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
                            <span class="text-yellow-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL020203.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL020203.do']) }}</span>
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
                            <span class="text-green-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL020901.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL020901.do']) }}</span>
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
                            <span class="text-purple-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL020401.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL020401.do']) }}</span>
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
                            <span class="text-teal-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL020801.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL020801.do']) }}</span>
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
                            <span class="text-pink-500 ml-3 font-medium">{{ utils.numberWithCommas(todyLtmCardLoanCount['/web/fin/ll/FINLL020501.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtLtmCardLoanCount['/web/fin/ll/FINLL020501.do']) }}</span>
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
                            <span class="text-orange-500 ml-3 font-medium">{{ utils.numberWithCommas(todyShtrCardLoanCount['/web/fin/sl/FINSL010101.do'] )}}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtShtrCardLoanCount['/web/fin/sl/FINSL010101.do'] )}}</span>
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
                            <span class="text-cyan-500 ml-3 font-medium">{{ utils.numberWithCommas(todyShtrCardLoanCount['/web/fin/sl/FINSL020101.do'] )}}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtShtrCardLoanCount['/web/fin/sl/FINSL020101.do']) }}</span>
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
                            <span class="text-yellow-500 ml-3 font-medium">{{ utils.numberWithCommas(todyShtrCardLoanCount['/web/fin/sl/FINSL090101.do'] )}}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtShtrCardLoanCount['/web/fin/sl/FINSL090101.do']) }}</span>
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
                            <span class="text-green-500 ml-3 font-medium">{{ utils.numberWithCommas(todyShtrCardLoanCount['/web/fin/sl/FINSL100102.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtShtrCardLoanCount['/web/fin/sl/FINSL100102.do']) }}</span>
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
                            <span class="text-teal-500 ml-3 font-medium">{{ utils.numberWithCommas(todyShtrCardLoanCount['/web/fin/at/FINAT020101.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtShtrCardLoanCount['/web/fin/at/FINAT020101.do']) }}</span>
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
                            <span class="text-pink-500 ml-3 font-medium">{{ utils.numberWithCommas(todyShtrCardLoanCount['/web/fin/sl/FINSL040101.do']) }}</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">{{ utils.numberWithCommas(bfdtShtrCardLoanCount['/web/fin/sl/FINSL040101.do']) }}</span>
                        </div>
                    </div>
                </li>
                <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <div style="width: 450px;">
                        <span class="text-900 font-medium mr-2 mb-1 md:mb-0"></span>
                        <div class="mt-1 text-600"></div>
                    </div>
                    <div class="mt-2 md:mt-0 flex flex-column align-items-center ml-3 w-full">
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="ml-3 font-medium">&nbsp;</span>
                        </div>
                        <div class="flex align-items-center w-full mb-2">
                            <div class="surface-300 border-round overflow-hidden w-full mr-5">
                            </div>
                            <span class="text-gray-500 ml-3 font-medium">&nbsp;</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

