<script setup>
import { ref, onBeforeMount } from 'vue';

const eventList = ref(null);
const filters = ref(null);
const serverType = ref('');
const startDate = ref(null);
const endDate = ref(null);
const loading = ref(false);

const serverTypes = ref([
    { name: 'MX', code: 'MX' },
    { name: '앱카드', code: 'APPCARD' }
]);

// 추가
const instanceValues = ref([
	{ name: '전체', code: 'ALL' },
    { name: 'mx21', code: 'mx21' },
    { name: 'mx22', code: 'mx22' },
    { name: 'mx23', code: 'mx23' },
    { name: 'mx24', code: 'mx24' },
    { name: 'mx25', code: 'mx25' },
    { name: 'mx26', code: 'mx26' }
]);
const instanceValue = ref('ALL');

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

const search = () => {
    loading.value = true;
		setTimeout(() => (loading.value = false), 1000);

		//validation check

		// 조회 API 호출
		console.log('검색 조건 : ' + serverTypes.value.code +  ',' + startDate.value + ', ' + endDate.value);

		// api 호출 후 loading.value = false
};

</script>

<template>
		<div class="grid">
				<div class="col-12">
				<div class="card">
          <div class="grid p-fluid">
              <div class="col-2 md:col-3">
                <h5>시스템구분</h5>
                  <Dropdown v-model="serverType" :options="serverTypes" optionLabel="name" placeholder="전체"/>
              </div>
              <div class="col-2 md:col-3">
                <h5>instance</h5>
                  <Dropdown v-model="instanceValue" :options="instanceValues" optionLabel="name" placeholder=" 전체"/>
              </div>
          </div>
					<div class="grid p-fluid">
            <div class="col-12 md:col-3">
              <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate" placeholder="조회 시작일"></Calendar>
            </div>
            <div class="col-2 md:col-3">
              <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate" placeholder="조회 종료일"></Calendar>
            </div>
					</div>
          <div class="grid p-fluid">
            <div class="col-12 md:col-3">
                <span class="p-input-icon-left p-input-icon-right">
                    <i class="pi pi-wifi" />
                    <InputText type="text" placeholder="클라이언트 IP" />
                    <i class="pi pi-search" />
                </span>
            </div>
            <div class="col-12 mb-2 md:col-3">
                <span class="p-input-icon-left p-input-icon-right">
                    <i class="pi pi-user" />
                    <InputText type="text" placeholder="고객번호" />
                    <i class="pi pi-search" />
                </span>
            </div>
            <div class="col-12 md:col-3">
                <span class="p-input-icon-left p-input-icon-right">
                    <InputText type="text" placeholder="API 명" />
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
				
					<template #empty> 결과가 없습니다. </template>
					<template #loading> Loading data.. Please wait. </template>
					<Column field="응답시간" header="응답 시간" dataType="date" style="min-width: 12rem">
						<template #body="{ data }">
							{{ data.duration }}
						</template>
					</Column>
					<Column header="instance" filterField="instance" style="min-width: 12rem">
						<template #body="{ data }">
							{{ data.host }}
						</template>
					</Column>
					<Column header="클라이언트 IP" filterField="클라이언트 IP" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
						<template #body="{ data }">
							{{ data.ip }}
						</template>
					</Column>
					<Column header="고객번호" filterField="고객번호" dataType="date" style="min-width: 10rem">
						<template #body="{ data }">
							{{ data.csno }}
						</template>
					</Column>
					<Column header="os명" filterField="os명" dataType="numeric" style="min-width: 10rem">
						<template #body="{ data }">
							{{ data.device }}
						</template>
					</Column>
					<Column field="API명" header="API명" style="min-width: 12rem">
						<template #body="{ data }">
							{{ data.api }}
						</template>
					</Column>
					<Column field="소요시간" header="소요시간"  style="min-width: 12rem">
									<template #body="{ data }">
										{{ data.duration }}
									</template>
								</Column>
					<Column field="결과코드" header="결과코드" style="min-width: 8rem">
						<template #body="{ data }">
							{{ data.return_code }}
						</template>
					</Column>
					<Column field="request" header="request" :showFilterMatchModes="false" style="min-width: 12rem">
						<template #body="{ data }">
							{{ data.req }}
						</template>
					</Column>
					<Column field="response" header="response" bodyClass="text-center" style="min-width: 8rem">
						<template #body="{ data }">
							{{ data.res }}
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
