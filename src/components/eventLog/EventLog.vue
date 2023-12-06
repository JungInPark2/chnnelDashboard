<script setup>
import { ref, onBeforeMount } from 'vue';
import { searchEventLogInfo } from '@/api/eventLog';
import JsonViewer from 'vue-json-viewer';
import { utils } from '@/utils/utils';


const serverTypes = ref([
		{ name: '전체', code: 'ALL' },
    { name: 'MX', code: 'mx' },
    { name: '앱카드', code: 'appcard' },
		{ name: '개인홈페이지', code: 'homepage' }
]);

const serverType = ref(serverTypes.value[0]);
const filters = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const csno = ref(null);
const ip = ref(null);
const loading = ref(false);
const isInvalid = ref(false);
const api = ref(null);
const isData = ref(true);
const errorMessage = ref('');
const eventList = ref(null);

onBeforeMount(() => {
	if(import.meta.env.MODE === 'L') {
    searchTempInfo();
  }
});

const valid = () => {
	if(!serverType.value.code || !startDate.value || !endDate.value || (!csno.value && !ip.value)){
		loading.value = false;
		return false;
	}
	return true;
}

const search = async () => {
	loading.value = true;

	if(!valid()){
		isInvalid.value = true;
		return;
	}

	isInvalid.value = false;
	
	const serverList = [];
	if(serverType.value.code == 'ALL') {
		serverList.push('mx');
		serverList.push('appcard');
		serverList.push('homepage');
	}else{
		serverList.push(serverType.value.code);
	}

	console.log('검색 조건:\n' + serverList, utils.formatIqrySrtDttm(startDate.value) , utils.formatIqryEndDttm(endDate.value), csno.value, ip.value, '*' + api.value + "*");
	
	try{
		api.value = api.value == null ? '' : api.value;
		const response = await searchEventLogInfo(serverList, utils.formatIqrySrtDttm(startDate.value) , utils.formatIqryEndDttm(endDate.value), csno.value, ip.value,  '*' + api.value + "*");
		loading.value = false;
		isData.value = true;
		eventList.value = [];

		eventList.value = response.hits.hits;
		eventList.value.forEach((event) => {
			event.value = event._source;	
			if(event.value.hc){
				event.time = event.value.hc.event.res.parsed ? event.value.hc.event.res.parsed.hdr.srvrDt + ' ' + event.value.hc.event.res.parsed.hdr.srvrEltm : '';
				event.csno = event.value.hc ? event.value.hc.csno : '';
				event.os = event.value.hc ? event.value.hc.os.platform + ' ' + event.value.hc.os.version : '';
				event.api = event.value.hc && event.value.hc.api ? event.value.hc.api.name : '';
				event.duration = event.value.hc ? event.value.hc.api.duration : '';
				event.service = event.value.hc.service ? event.value.hc.service.name : '';
				event.resltcd = event.value.hc.event.res.parsed ? event.value.hc.event.res.parsed.hdr.rsltCd : '';

				try {
						event.request =  event.value.hc && event.value.hc.event && event.value.hc.event.req ? JSON.parse(event.value.hc.event.req.message) : '';
						event.response = event.value.hc && event.value.hc.event && event.value.hc.event.res ? JSON.parse(event.value.hc.event.res.message) : '';
					} catch (error) {
						event.request =  event.value.hc && event.value.hc.event && event.value.hc.event.req ? event.value.hc.event.req.message : '';
						event.response = event.value.hc && event.value.hc.event && event.value.hc.event.res ? event.value.hc.event.res.message : '';
					}
			}
			event.instance = event.value.agent ? event.value.agent.name : '';
			event.ip = event.value.source ? event.value.source.ip : '';
		});  

	}catch (error) {
		eventList.value = [];
    isData.value = false;
		errorMessage.value = error.message;
  }
	
};

const searchTempInfo = () => {
		fetch('demo/event.json')
		.then((res) => res.json())
		.then((d) => { 
				eventList.value = d.hits.hits;
				eventList.value.forEach((event) => {
				event.value = event._source;	
				if(event.value.hc){
					event.time = event.value.hc.event.res.parsed ? event.value.hc.event.res.parsed.hdr.srvrDt + ' ' + event.value.hc.event.res.parsed.hdr.srvrEltm : '';
					event.csno = event.value.hc ? event.value.hc.csno : '';
					event.os = event.value.hc ? event.value.hc.os.platform + ' (' + event.value.hc.os.version + ')' : '';
					event.api = event.value.hc && event.value.hc.api ? event.value.hc.api.name : '';
					event.duration = event.value.hc ? event.value.hc.api.duration : '';
					event.service = event.value.hc.service ? event.value.hc.service.name : '';
					event.resltcd = event.value.hc.event.res.parsed ? event.value.hc.event.res.parsed.hdr.rsltCd : '';

					try {
						event.request =  event.value.hc && event.value.hc.event ? JSON.parse(event.value.hc.event.req.message) : '';
						event.response = event.value.hc && event.value.hc.event ? JSON.parse(event.value.hc.event.res.message) : '';
					} catch (error) {
						event.request =  event.value.hc && event.value.hc.event ? event.value.hc.event.req.message : '';
						event.response = event.value.hc && event.value.hc.event ? event.value.hc.event.res.message : '';
					}
				}
				event.instance = event.value.agent ? event.value.agent.name : '';
				event.ip = event.value.source ? event.value.source.ip : '';
			});
			//loading.value = false;
		})
}
</script>

<template>
		<div class="grid">
			<div class="col-12">
				<div class="card">
					<div class="grid p-fluid">
						<div class="col-2 md:col-3">
							<span class="p-float-label">
								<Dropdown id = "serverType" v-model="serverType" :options="serverTypes" optionLabel="name" />
								<label for="serverType">시스템구분</label>
							</span>
						</div>
					<!--<div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <MultiSelect id="multiselect" :options="instanceValues" v-model="instanceValue" optionLabel="name" :filter="true" :class="{ 'p-invalid': isInvalid }" >
											<template #value="slotProps">
                        <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                            <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ option.name }}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                            <div class="p-1">Select Countries</div>
                        </template>
                    </template>
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
										
										</MultiSelect>
                    <label for="multiselect">instance</label>
                </span>
            </div>	-->	
					</div>
					<div class="grid p-fluid">
						<div class="col-12 md:col-3">
							<Calendar :showIcon="true" :showButtonBar="true" v-model="startDate" placeholder="조회 시작일" showTime hourFormat="24" dateFormat="yy.mm.dd" :class="{ 'p-invalid': isInvalid && !startDate}"></Calendar>
						</div>
						<div class="col-2 md:col-3">
							<Calendar :showIcon="true" :showButtonBar="true" v-model="endDate" placeholder="조회 종료일" showTime hourFormat="24" dateFormat="yy.mm.dd" :class="{ 'p-invalid': isInvalid && !endDate}"></Calendar>
						</div>
					</div>
					<div class="grid p-fluid">
						<div class="col-12 md:col-3">
							<span class="p-input-icon-left p-input-icon-right">
									<i class="pi pi-wifi" />
									<InputText type="text" placeholder="클라이언트 IP" v-model="ip" :class="{ 'p-invalid': isInvalid && !ip && !csno}"  />
									<i class="pi pi-search" />
							</span>
							<small v-if="isInvalid && !ip && !csno" class="p-error" id="text-error">IP주소 또는 고객번호 중 하나 이상을 입력해주세요.</small>
						</div>
						<div class="col-12 md:col-3">
							<span class="p-input-icon-left p-input-icon-right">
									<i class="pi pi-user" />
									<InputText type="text" placeholder="고객번호" v-model="csno" maxlength="10" v-on:input="$event.target.value = $event.target.value.replace(/[^0-9]/g, '')" :class="{ 'p-invalid': isInvalid && !ip && !csno}" />
									<i class="pi pi-search" />
							</span>
							<small v-if="isInvalid && !ip && !csno" class="p-error" id="text-error">IP주소 또는 고객번호 중 하나 이상을 입력해주세요.</small>
						</div>
						<div class="col-12 md:col-3">
							<span class="p-input-icon-left p-input-icon-right">
									<InputText type="text" placeholder="API명" v-model="api" />
									<i class="pi pi-search" />
							</span>
						</div>
						<div class="col-12 md:col-3">
							<Button type="button"  icon="pi pi-search" class="mr-2 mb-2" :loading="loading" @click="search()" />
						</div>
					</div>
			</div>
		</div>

		<div v-if="isData" class="col-12"> 
			<div class="card">
				<DataTable
					:value="eventList"
					:paginator="true"
					class="p-datatable-gridlines"
					:rows="20"
					dataKey="id"
					:rowHover="true"
					v-model:filters="filters"
					filterDisplay="menu"
					:loading="loading"
					:filters="filters"
					responsiveLayout="scroll"
				>
					<template #empty>조회된 결과가 없습니다.</template>
					<template #loading> Loading data.. Please wait. </template>
					<Column field="시스템구분" header="시스템구분" dataType="date" >
						<template #body="{ data }">
							{{ data.service }}
						</template>
					</Column>
					<Column field="응답시간" header="응답 시간" dataType="date" >
						<template #body="{ data }">
							{{ data.time }}
						</template>
					</Column>
					<Column header="instance" filterField="instance" >
						<template #body="{ data }">
							{{ data.instance }}
						</template>
					</Column>
					<Column header="클라이언트 IP" filterField="클라이언트 IP" >
						<template #body="{ data }">
							{{ data.ip }}
						</template>
					</Column>
					<Column header="고객번호" filterField="고객번호">
						<template #body="{ data }">
							{{ data.csno }}
						</template>
					</Column>
					<Column header="OS타입(버전)" filterField="OS타입(버전)">
						<template #body="{ data }">
							{{ data.os }}
						</template>
					</Column>
					<Column field="API명" header="API명" style="min-width: 12rem" >
							<template #body="{ data }" >
								<div class="surface-overlay overflow-hidden text-overflow-ellipsis" style="width:200px">{{ data.api }}</div>
							</template>
					</Column>
					<Column field="소요시간" header="소요시간" >
						<template #body="{ data }">
							{{ data.duration }}
						</template>
					</Column>
					<Column field="결과코드" header="결과코드">
						<template #body="{ data }">
							{{ data.resltcd }}
						</template>
					</Column>
					<Column field="request" header="request" >
						<template #body="{ data }">
							<Accordion >
								<AccordionTab header="보기">
										<p class="line-height-3 m-0">
											<json-viewer :value="data.request" copyable></json-viewer>
										</p>
								</AccordionTab>
						</Accordion>
						</template>
					</Column>
					<Column field="response" header="response" >
						<template #body="{ data }">
							<Accordion >
								<AccordionTab header="보기">
										<p class="line-height-3 m-0">
											<json-viewer :value="data.response" copyable></json-viewer>
										</p>
								</AccordionTab>
						</Accordion>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
	</div>

	<div class="grid">
		<div class="col-12">
		<div v-if="!isData" class="surface-ground  align-items-center justify-content-center  overflow-hidden">
				<div class="flex flex-column align-items-center justify-content-center">
						<div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
								<div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
										<div class="grid flex flex-column align-items-center">
												<div class="flex justify-content-center align-items-center bg-pink-500 border-circle" style="height: 3.2rem; width: 3.2rem">
														<i class="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
												</div>
												<h1 class="text-900 font-bold text-5xl mb-2">Error Code {{  errorMessage }}</h1>
												<span class="text-600 mb-5">통신 중 에러가 발생 하였습니다.</span>
												<img src="/error/asset-error.svg" alt="Error" class="mb-5" width="80%" />
										</div>
								</div>
						</div>
				</div>
		</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
	font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
	font-weight: bold;
}
</style>
