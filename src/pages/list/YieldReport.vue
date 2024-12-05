<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHarvests } from '@/api/report'
import { formatDate, hasPermission } from '@/utils'
import ListFilter from "@/pages/filter/ListFilter.vue";

interface Filter {
  [key: string]: any
}

interface Harvest {
  farmer: string
  contact: string
  farm: string
  center: string
  cohort: string
  start_date: string
  harvests_count: number
  harvests_sum_weight: number
}

const isLoading = ref<boolean>(false)
const harvests = ref<Harvest[]>([])
const per_page = ref(0)
const current_page = ref(1)
const totalHarvest = ref(0)
const totalCount = ref(0)
const pages = ref(0)
const total = ref(0)
let form_filter_params: Filter = {}
// eslint-disable-next-line camelcase
let entity_params: Filter = {}

const filterList = filterForm => {
  // eslint-disable-next-line camelcase
  form_filter_params = filterForm
  current_page.value = 1
  fetchData()
}


const fetchData = async (): Promise<void> => {
  isLoading.value = true

  try {
    entity_params = {...form_filter_params, ...{ page: current_page.value, orderBy: 'created_at', sortedBy: 'desc' }}

    const response = await getHarvests(entity_params)
    pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page)
    total.value = response.data.data?.total
    per_page.value = response.data.data?.per_page
    harvests.value = response.data?.data?.data
    totalCount.value = response.data.data?.total_counts
    totalHarvest.value = response.data.data?.total_weight
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const headers = [
  { title: 'CENTER', key: 'center' },
  { title: 'COHORT', key: 'cohort' },
  { title: 'FARMER', key: 'farmer' },
  { title: 'CONTACT', key: 'contact' },
  { title: 'FARM', key: 'farm' },
  { title: 'COUNT', key: 'harvests_count' },
  { title: 'YIELD', key: 'harvest_weight' },

]


const formattedHarvests = computed(() => {
  return harvests.value?.map(harvest => ({
    ...harvest,
    farmer: `${harvest.farm.user.first_name} ${harvest.farm.user.middle_name} ${harvest.farm.user.last_name}`.trim(),
    contact: harvest.farm.user.phone_number,
    farm: `${harvest.farm?.location}, ${harvest.farm?.size.trim()}`,
    center: harvest.cohort?.center?.name ?? 'N/A',
    cohort: harvest.cohort.name,
    harvests_count:  Number(harvest.harvests_count ?? 0).toFixed(2),
    harvest_weight: Number(harvest.harvests_sum_weight ?? 0).toFixed(2),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Yields List</VCardTitle>
      <template #append>
        <ListFilter
          filter_farmer
          filter_cohort
          :filter_offtaker="false"
          :filter_first_name="false"
          :filter_middle_name="false"
          :filter_last_name="false"
          :filter_phone_number="false"
          :filter_email="false"
          filter_center
          filter_date
          :filter_system_user="false"
          title="Filter Farm Yield List"
          @on-filter="filterList"

        />
      </template>
    </VCardItem>
  </VCard>

  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.center')"
      :headers="headers"
      :items="formattedHarvests"
      :items-per-page="per_page"
      height="800"
      fixed-header
    >
      <template #top>
        <div class="flex">
          <VChip class="my-5 mx-5">
            Total No. of Harvests: {{ totalCount }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total (Kg): {{totalHarvest}}
          </VChip>
        </div>

      </template>
      <template #bottom>
        <VRow class="justify-center">
          <VPagination
            v-model="current_page"
            class="my-4"
            :length="pages"
            :total-visible="5"
            @first="fetchData"
            @last="current_page = pages"
            @update:model-value="fetchData"
          />
          <VChip class="my-5 mx-5">
            Total Records: {{ total }}
          </VChip>
        </VRow>
      </template>
    </VDataTable>
    <div
      v-if="isLoading"
      class="overlay"
    >
      <VProgressCircular
        :size="50"
        color="primary"
        indeterminate
      />
    </div>
  </div>
</template>

<style scoped>
.table-container {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
