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
const loading = ref(false);

// API 호출 함수
const fetchData = async () => {

    loading.value = true;
		setTimeout(() => (loading.value = false), 1000);

    // const serviceName = dropdownValue.value.code; // 시스템 구분
    // const gteDttm = iqrySrtDttm.value;  // 조회 시작일시
    // const lteDttm = iqryEndDttm.value;  // 조회 종료일시
    // const guid = guid.value;    // GUID
    // const ipAddress = ipAddress.value; // IP주소
    // const csno = csno.value;    // 고객번호

    const response = await searchXmpLogInfo(dropdownValue.value.code, iqrySrtDttm.value, iqryEndDttm.value, guid.value, ipAddress.value, csno.value);
    apiResponse.value = response;

    // API 응답에서 필요한 데이터 추출
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
                        <form @submit="fetchData" class="flex flex-column gap-2">
                            <div class="card flex flex-column md:flex gap-3">
                                <div class="grid p-fluid">
                                    <div class="col-2 md:col-3">
                                        <span class="p-float-label">
                                            <Dropdown id = "dropdownValue" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="시스템구분" />
                                            <label for="dropdownValue">시스템구분</label>
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-float-label">
                                            <Calendar :showIcon="true" id="calendar-24h" v-model="iqrySrtDttm" showTime hourFormat="24" dateFormat="yy.mm.dd" />
                                            <label for="calendar-24h">조회시작일시</label>
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-float-label">
                                            <Calendar :showIcon="true" id="calendar-24h" v-model="iqryEndDttm" showTime hourFormat="24" dateFormat="yy.mm.dd" />
                                            <label for="calendar-24h">조회종료일시</label>
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-input-icon-left p-input-icon-right p-float-label">
                                            <i class="pi pi-file" />
                                            <InputText id="guid" v-model="guid" type="text" />
                                            <label for="guid">GUID</label>
                                            <i class="pi pi-search" />
                                        </span>
                                    </div>
                                </div>
                                <div class="grid p-fluid">
                                    <div class="col-12 md:col-3">
                                        <span class="p-input-icon-left p-input-icon-right p-float-label">
                                            <i class="pi pi-wifi" />
                                            <InputText id="ipAddress" v-model="ipAddress" type="text" />
                                            <label for="guid">IP주소</label>
                                            <i class="pi pi-search" />
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-input-icon-left p-input-icon-right p-float-label">
                                            <i class="pi pi-user" />
                                            <InputText id="csno" v-model="csno" type="text" />
                                            <label for="guid">고객번호</label>
                                            <i class="pi pi-search" />
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <Button type="button"  icon="pi pi-search" class="mr-2 mb-2" :loading="loading" @click="fetchData()" />
                                    </div>
                                </div>
                            </div>

                        </form>
                        
                    </template>
                </Card>
                <Card>
                    <template #title> 조회결과 </template>
                    <template #content>
                        <div class="card">
                            <DataTable :value="iqryCn" sortMode="multiple" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" :loading="loading">
                                <template #empty> 결과가 없습니다. </template>
					            <template #loading> </template>
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
