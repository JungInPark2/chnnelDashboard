<script setup>
import { ref, onBeforeMount } from 'vue';
import JsonViewer from 'vue-json-viewer';

const serverTypes = ref([
		{ name: '전체', code: 'ALL' },
    { name: 'MX', code: 'MX' },
    { name: '앱카드', code: 'APPCARD' }
]);

// TODO 추가
const instanceValues = ref([
    { name: 'mx21', code: 'mx21' },
    { name: 'mx22', code: 'mx22' },
    { name: 'mx23', code: 'mx23' },
    { name: 'mx24', code: 'mx24' },
    { name: 'mx25', code: 'mx25' },
    { name: 'mx26', code: 'mx26' }
]);

const serverType = ref(serverTypes.value[0]);
const instanceValue = ref([]);
const filters = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const csno = ref(null);
const ip = ref(null);
const eventList = ref(null);
const loading = ref(false);
const isInvalid = ref(false);
const apiName = ref(null);

onBeforeMount(() => {
	  fetch('demo/customers-large.json')
		.then((res) => res.json())
		.then((d) => { 
			eventList.value = d.hits.hits;
			loading.value = false;

			eventList.value.forEach((event) => {
				event.value = event._source;

				//필드 안내려오는건 validation 체크 어떤게 좋을 지 고민 
				event.duration = event.value.hc ? event.value.hc.api.duration : '';
				event.host = event.value.agent ? event.value.agent.name : '';
				event.ip = event.value.source ? event.value.source.ip : '';
				event.api = event.value.hc && event.value.hc.api ? event.value.hc.api.name : '';
				event.csno = event.value.event ? event.value.event.req.message.csno : '';
				event.req = event.value.hc && event.value.hc.event ? event.value.hc.event.req : '';
				event.res = event.value.hc && event.value.hc.event ? event.value.hc.event.res : '';
				event.device = event.value.hc && event.value.hc.device ? event.value.hc.device.info : '';
			});
		})

	initFilters();
});

const initFilters = () => {
	// 초기 조건 세팅
	filters.value = {
		
	};
};

const valid = () => {
	
	isInvalid.value = true;
	
	if(!serverType.value.code || instanceValue.value.length == 0 || !startDate.value || !endDate.value || (!csno.value && !ip.value)){
		loading.value = false;
		return false;
	}
	return true;
}

const search = () => {

	loading.value = true;

	if(!valid()) return;

	console.log('검색 조건:\n' + serverType.value.code, instanceValue.value, startDate.value , endDate.value, csno.value, ip.value, apiName);
	//api request 요청 포맷 확인
	setTimeout(() => (loading.value = false), 1000);
	isInvalid.value = false;
};

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
						<div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <MultiSelect id="multiselect" :options="instanceValues" v-model="instanceValue" optionLabel="name" :filter="false" :class="{ 'p-invalid': isInvalid && instanceValue.length == 0}" ></MultiSelect>
                    <label for="multiselect">instance</label>
                </span>
								
            </div>
					</div>
					<div class="grid p-fluid">
						<div class="col-12 md:col-3">
							<Calendar :showIcon="true" :showButtonBar="true" v-model="startDate" placeholder="조회 시작일" hourFormat="24" dateFormat="yy.mm.dd" :class="{ 'p-invalid': isInvalid && !startDate}"></Calendar>
						</div>
						<div class="col-2 md:col-3">
							<Calendar :showIcon="true" :showButtonBar="true" v-model="endDate" placeholder="조회 종료일" hourFormat="24" dateFormat="yy.mm.dd" :class="{ 'p-invalid': isInvalid && !endDate}"></Calendar>
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
									<InputText type="text" placeholder="API명" v-model="apiName" />
									<i class="pi pi-search" />
							</span>
						</div>
						<div class="col-12 md:col-3">
							<Button type="button"  icon="pi pi-search" class="mr-2 mb-2" :loading="loading" @click="search()" />
						</div>
					</div>
			</div>
		</div>

		<div class="col-12">
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
					<Column field="응답시간" header="응답 시간" dataType="date" >
						<template #body="{ data }">
							{{ data.duration }}
						</template>
					</Column>
					<Column header="instance" filterField="instance" >
						<template #body="{ data }">
							{{ data.host }}
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
					<Column header="os명" filterField="os명">
						<template #body="{ data }">
							{{ data.device }}
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
							{{ data.return_code }}
						</template>
					</Column>
					<Column field="request" header="request" >
						<template #body="{ data }">
							<Accordion >
								<AccordionTab header="보기">
										<p class="line-height-3 m-0">
											<json-viewer :value="data.req" copyable></json-viewer>
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
											<json-viewer :value="data.res" copyable></json-viewer>
										</p>
								</AccordionTab>
						</Accordion>
						</template>
					</Column>
				</DataTable>
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
