<script setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { searchEventLogInfo } from '@/api/eventLog';
import JsonViewer from 'vue-json-viewer';

const serverTypes = ref([
		{ name: '전체', code: '' },
    { name: 'MX', code: 'mx' },
    { name: '앱카드', code: 'appcard' }
]);

const instanceValues = ref([
{ name: 'mx11', code: 'mx11' }, { name: 'mx12', code: 'mx12' }, { name: 'mx13', code: 'mx13' }, { name: 'mx14', code: 'mx14' }, { name: 'mx15', code: 'mx15' }, { name: 'mx16', code: 'mx16' }
    ,{ name: 'mx21', code: 'mx21' }, { name: 'mx22', code: 'mx22' }, { name: 'mx23', code: 'mx23' }, { name: 'mx24', code: 'mx24' }, { name: 'mx25', code: 'mx25' }, { name: 'mx26', code: 'mx26' }
    ,{ name: 'mx31', code: 'mx31' }, { name: 'mx32', code: 'mx32' }, { name: 'mx33', code: 'mx33' }, { name: 'mx34', code: 'mx34' }, { name: 'mx35', code: 'mx35' }, { name: 'mx36', code: 'mx36' }
    ,{ name: 'mx41', code: 'mx41' }, { name: 'mx42', code: 'mx42' }, { name: 'mx43', code: 'mx43' }, { name: 'mx44', code: 'mx44' }, { name: 'mx45', code: 'mx45' }, { name: 'mx46', code: 'mx46' }
    ,{ name: 'mx51', code: 'mx51' }, { name: 'mx52', code: 'mx52' }, { name: 'mx53', code: 'mx53' }, { name: 'mx54', code: 'mx54' }, { name: 'mx55', code: 'mx55' }, { name: 'mx56', code: 'mx56' }
    ,{ name: 'mx61', code: 'mx61' }, { name: 'mx62', code: 'mx62' }, { name: 'mx63', code: 'mx63' }, { name: 'mx64', code: 'mx64' }, { name: 'mx65', code: 'mx65' }, { name: 'mx66', code: 'mx66' }
]);

const serverType = ref(serverTypes.value[0]);
const instanceValue = ref(instanceValues);
const filters = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const csno = ref(null);
const ip = ref(null);
const eventList = ref(null);
const loading = ref(false);
const isInvalid = ref(false);
const api = ref(null);

const resultList = reactive([
   {time : '', instance : '', ip : '', csno : '', os : '', api : '', duration : '' , resltcd : '', request : '', response : ''}
])

onBeforeMount(() => {
	if(import.meta.env.MODE === 'L' || import.meta.env.MODE === 'D') {
    searchTempInfo();
		console.log('검색조건:' + serverType.value.code , instanceValue.value.code, startDate.value, endDate.value, csno.value, ip.value, api.name);
  }
});

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

	//if(!valid()) return;

	const serverList = ['mx', 'appcard'];

  // serverType.value.forEach(obj => {
	// 	serverList.push(obj.code);
	// })

	const instanceList = [];
  instanceValue.value.forEach(obj => {
    instanceList.push(obj.code);
  });

	console.log('검색 조건:\n' + serverList, instanceList, startDate.value , endDate.value, csno.value, ip.value, api.value);
	
	searchEventLogInfo(serverList, instanceList, startDate.value , endDate.value, csno.value, ip.value, api.value);
	isInvalid.value = false;
};

const searchTempInfo = () => {
		fetch('demo/event.json')
		.then((res) => res.json())
		.then((d) => { 
			eventList.value = d.hits.hits;
			loading.value = false;

			eventList.value.forEach((event) => {
				event.value = event._source;	
				//필드 안내려오는건 validation 체크 어떤게 좋을 지 고민 
				event.time = event.value.hc ? event.value.timestamp : '';
				event.instance = event.value.agent ? event.value.agent.name : '';
				event.ip = event.value.source ? event.value.source.ip : '';
				event.csno = event.value.hc ? event.value.hc.csno : '';
				event.os = event.value.hc ? event.value.hc.os.platform + ' ' + event.value.hc.os.version : '';
				event.api = event.value.hc && event.value.hc.api ? event.value.hc.api.name : '';
				event.duration = event.value.hc ? event.value.hc.api.duration : '';
				event.resltcd = '0000';
				event.request = event.value.hc && event.value.hc.event ? event.value.hc.event.req.message : '';
				event.response = event.value.hc && event.value.hc.event ? event.value.hc.event.res.message : '';
			});
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
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
	font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
	font-weight: bold;
}
</style>
