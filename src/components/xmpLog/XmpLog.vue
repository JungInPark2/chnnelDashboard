<script setup>
import { ref } from 'vue';
import { searchXmpLogInfo } from '@/api/XmpLog';

// API 호출 결과를 저장할 변수
const apiResponse = ref([]);
// 조회 내용
const iqryCn = ref();

const dropdownValues = ref([
    { name: 'MX', code: 'mx' },
    { name: '앱카드', code: 'appcard' }
]);

// 입력 필드
const dropdownValue = ref('');
const iqrySrtDttm = ref('');
const iqryEndDttm = ref('');
const guid = ref('');
const ipAddress = ref('');
const csno = ref('');

// API 호출 함수
const fetchData = async () => {

    // const serviceName = dropdownValue.value.code; // 시스템 구분
    // const gteDttm = iqrySrtDttm.value;  // 조회 시작일시
    // const lteDttm = iqryEndDttm.value;  // 조회 종료일시
    // const guid = guid.value;    // GUID
    // const ipAddress = ipAddress.value; // IP주소
    // const csno = csno.value;    // 고객번호

    const response = await searchXmpLogInfo(dropdownValue.value.code, iqrySrtDttm.value, iqryEndDttm.value, guid.value, ipAddress.value, csno.value);
    apiResponse.value = response;
    // console.log("apiResponse",apiResponse);
    // console.log("apiResponse.value.took",apiResponse.value.took);

    // data.value = apiResponse.value.hits.hits;
    // console.log("data",data);
    // console.log("data.fields[@timestamp]",data.fields);

    // API 응답에서 필요한 데이터를 추출합니다.
    iqryCn.value = apiResponse.value.hits.hits.map(hit => {
        return {
            dttm: hit.fields["@timestamp"][0], 
            guid: hit.fields["hc.guid.fst"][0],
            ipAddress: hit.fields["related.ip"].join(', '),
            csno: hit.fields["hc.csno"][0],
            xmpLog: hit.fields["message"][0]
        };
    });
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Card>
                    <template #title> 조회조건 </template>
                    <template #content>
                        <div class="card flex flex-column md:flex gap-3">
                            <div class="p-inputgroup flex-1">
                                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="시스템구분" />

                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-calendar"></i>
                                </span>
                                <Calendar id="calendar-24h" v-model="iqrySrtDttm" showTime hourFormat="24" dateFormat="yy.mm.dd" />
                                ~
                                <Calendar id="calendar-24h" v-model="iqryEndDttm" showTime hourFormat="24" dateFormat="yy.mm.dd" />

                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-file"></i>
                                </span>
                                <InputText v-model="guid" placeholder="GUID" />

                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-wifi"></i>
                                </span>
                                <InputText v-model="ipAddress" placeholder="IP주소" />

                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-user"></i>
                                </span>
                                <InputText v-model="csno" placeholder="고객번호" /> 

                                <Button label="조회" class="p-button-help p-button-text mr-2 mb-2" @click="fetchData" />
                            </div>
                        </div>
                    </template>
                </Card>
                <Card>
                    <template #title> 조회결과 </template>
                    <template #content>
                        <div class="card">
                            <DataTable :value="iqryCn" sortMode="multiple" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                                <Column field="dttm" header="일시" sortable style="width: 20%"></Column>
                                <Column field="guid" header="GUID" sortable style="width: 20%"></Column>
                                <Column field="ipAddress" header="IP주소" sortable style="width: 20%"></Column>
                                <Column field="csno" header="고객번호" sortable style="width: 20%"></Column>
                                <Column field="xmpLog" header="전문로그" sortable style="width: 20%"></Column>
                            </DataTable>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>
