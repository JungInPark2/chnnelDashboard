<script setup>
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { searchXmpLogInfo } from '@/api/XmpLog';

// API 호출 결과를 저장할 변수
const apiResponse = ref([]);
const iqryCn = ref();

// 입력 필드
const dropdownValues = ref([
    { name: 'MX', code: 'mx' },
    { name: '앱카드', code: 'appcard' }
]);

const dropdownValue = ref(dropdownValues.value[0]); 
const iqrySrtDttm = ref('');
const iqryEndDttm = ref('');
const guid = ref('');
const ipAddress = ref('');
const csno = ref('');
const loading = ref(false);
const errorMessage = ref(''); 

const { handleSubmit } = useForm();

// Validation Check
const validateGuid = (event) => {
    event.target.value = event.target.value.replace(/[^A-Za-z0-9]/g, '');   // 숫자, 영문만 입력 가능
    guid.value = event.target.value;
};

const validateCsno = (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력 가능
    csno.value = event.target.value;
};

const validateIpAddress = (event) => {
    event.target.value = event.target.value.replace(/[^0-9.]/g, ''); // 숫자와 .만 입력 가능
    ipAddress.value = event.target.value;
};

const validateIqrySrtDttm = () => {
    return iqrySrtDttm.value ? true : '조회 시작일을 입력해주세요.';
};

const validateIqryEndDttm = () => {
    if (!iqryEndDttm.value) {
        return '조회 종료일을 입력해주세요.';
    }else if(new Date(iqryEndDttm.value) < new Date(iqrySrtDttm.value)){
        return '조회 종료일은 조회 시작일 보다 뒤여야 합니다.';
    }else{
        return true;
    }
};

const validateInputs = () => {
    if (guid.value || ipAddress.value || csno.value) return true;
    return "GUID, IP주소 또는 고객번호 중 하나 이상을 입력해주세요.";
};

const { errorMessage: errorMessageIqrySrtDttm } = useField('iqrySrtDttm', validateIqrySrtDttm);
const { errorMessage: errorMessageIqryEndDttm } = useField('iqryEndDttm', validateIqryEndDttm);
const { errorMessage: errorMessageInputs, validate: validateAdditionalInputs } = useField('additionalInputs', validateInputs);

const onSubmit = handleSubmit(() => {
    const areDatesFilled = iqrySrtDttm.value && iqryEndDttm.value;
    const areAdditionalInputsValid = validateAdditionalInputs();
    
    if (areDatesFilled && areAdditionalInputsValid) {
        fetchData();
    }
});

// API 호출 함수
const fetchData = async () => {

    if (iqrySrtDttm.value) {
        const startDate = new Date(iqrySrtDttm.value);
        startDate.setHours(0, 0, 0, 0);
        iqrySrtDttm.value = startDate;
    }

    if (iqryEndDttm.value) {
        const endDate = new Date(iqryEndDttm.value);
        endDate.setHours(23, 59, 59, 999);
        iqryEndDttm.value = endDate;
    }

    loading.value = true;

    // API 호출
    try{
        const response = await searchXmpLogInfo(dropdownValue.value.code,iqrySrtDttm.value,iqryEndDttm.value,guid.value,ipAddress.value,csno.value);

        apiResponse.value = response;
        loading.value = false;
        
        // API 응답에서 필요한 데이터 추출
        iqryCn.value = apiResponse.value.hits.hits.map(hit => {
            let formattedDttm = '',
                originalDttm = hit.fields["@timestamp"] ? hit.fields["@timestamp"][0] : '';
            
            if (originalDttm) {
                try {
                    const dateObj = new Date(originalDttm);
                    formattedDttm = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
                } catch (dateError) {
                    formattedDttm = originalDttm;
                }
            }
            return {
                dttm: formattedDttm,
                guid: hit.fields["hc.guid.fst"] ? hit.fields["hc.guid.fst"][0] : '',
                ipAddress: hit.fields["hc.transaction.common.TRM_IPAD"] ? hit.fields["hc.transaction.common.TRM_IPAD"].join(', ') : '',
                csno: hit.fields["hc.csno"] ? hit.fields["hc.csno"][0] : '',
                sarClsf: hit.fields["hc.event.category"] ? hit.fields["hc.event.category"][0] : '',
                xmpLog: hit.fields["message"] ? hit.fields["message"][0] : '',
                xmpId:  hit.fields["hc.transaction.common.TRX_CD"] ? hit.fields["hc.transaction.common.TRX_CD"][0] : ''
            };
        });
        } catch(error) {
            loading.value = false;
            errorMessage.value = "데이터 조회 중 오류가 발생하였습니다.";
        }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Card>
                    <template #title> 조회조건 </template>
                    <template #content>
                        <form @submit="onSubmit" class="flex flex-column gap-2">
                            <div class="card flex flex-column md:flex gap-3">
                                <div class="grid p-fluid">
                                    <div class="col-2 md:col-3">
                                        <span class="p-float-label">
                                            <Dropdown id = "dropdownValue" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" />
                                            <label for="dropdownValue">시스템구분</label>
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-float-label">
                                            <Calendar :showIcon="true" id="calendar-24h" v-model="iqrySrtDttm" hourFormat="24" dateFormat="yy.mm.dd" />
                                            <label for="calendar-24h">조회 시작일</label>
                                        </span>
                                        <small class="p-error" id="text-error">{{ errorMessageIqrySrtDttm || '&nbsp;' }}</small>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-float-label">
                                            <Calendar :showIcon="true" id="calendar-24h" v-model="iqryEndDttm" hourFormat="24" dateFormat="yy.mm.dd" />
                                            <label for="calendar-24h">조회 종료일</label>
                                        </span>
                                        <small class="p-error" id="text-error">{{ errorMessageIqryEndDttm || '&nbsp;' }}</small>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-input-icon-left p-input-icon-right p-float-label">
                                            <i class="pi pi-file" />
                                            <InputText id="guid" v-model="guid" type="text" @input.native="validateGuid" maxlength="32" />
                                            <label for="guid">GUID</label>
                                            <i class="pi pi-search" />
                                        </span>
                                        <small class="p-error">{{ errorMessageInputs || '&nbsp;' }}</small>
                                    </div>
                                </div>
                                <div class="grid p-fluid">
                                    <div class="col-12 md:col-3">
                                        <span class="p-input-icon-left p-input-icon-right p-float-label">
                                            <i class="pi pi-wifi" />
                                            <InputText id="ipAddress" v-model="ipAddress" type="text" @input.native="validateIpAddress" maxlength="15" />
                                            <label for="guid">IP주소</label>
                                            <i class="pi pi-search" />
                                        </span>
                                        <small class="p-error">{{ errorMessageInputs || '&nbsp;' }}</small>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <span class="p-input-icon-left p-input-icon-right p-float-label">
                                            <i class="pi pi-user" />
                                            <InputText id="csno" v-model="csno" type="text" @input.native="validateCsno" maxlength="10" />
                                            <label for="guid">고객번호</label>
                                            <i class="pi pi-search" />
                                        </span>
                                        <small class="p-error">{{ errorMessageInputs || '&nbsp;' }}</small>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <Button type="submit"  icon="pi pi-search" class="mr-2 mb-2" :loading="loading" />
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
                                <template #empty>
                                    <div class="centered-content" v-if="!errorMessage">조회된 결과가 없습니다.</div>
                                    <div class="p-error centered-content" v-if="errorMessage">{{ errorMessage }}</div>
                                </template>
					            <template #loading> </template>
                                <Column field="dttm" header="일시" sortable style="width: 20%"></Column>
                                <Column field="xmpId" header="전문ID" sortable style="width: 10%"></Column>
                                <Column field="guid" header="GUID" sortable style="width: 20%"></Column>
                                <Column field="ipAddress" header="IP주소" sortable style="width: 10%"></Column>
                                <Column field="csno" header="고객번호" sortable style="width: 10%"></Column>
                                <Column field="sarClsf" header="구분" sortable style="width: 10%"></Column>
                                <Column field="xmpLog" header="전문로그" sortable style="width: 20%"></Column>
                            </DataTable>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.centered-content {
    display: flex;
    justify-content: center;
    align-items: center; 
    height: 100%;     
    text-align: center;
}
</style>
