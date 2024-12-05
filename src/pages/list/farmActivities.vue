<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { getFarmerActivities, removeFarmActivity } from '@/api/farmer'
import SiteVisitModal from '@/pages/modals/addSiteVisitModal.vue'
import { formatDate, hasPermission } from '@/utils'
import ApproveFarmActivityModal from '@/pages/modals/approveFarmActivityModal.vue'
import ListFilter from '@/pages/filter/ListFilter.vue'

// Define the types
interface Filter {
  [key: string]: any
}

interface RateCard {
  name: string
  description: number
  effective_date: number
  created_at: number
}
const farm_activity_id = ref('')
const isLoading = ref<boolean>(false)
const farmActivities = ref<RateCard[]>([])
const site_visit_dialog = ref(false)
const per_page = ref(0)
const current_page = ref(1)
const pages = ref(0)
const total = ref(0)
const selected = ref([])
const approveActivitiesDialog = ref(false)
let entity_params: Filter = {}
let form_filter_params: Filter = {}
const fetchData = async (): Promise<void> => {
  isLoading.value = true
  try {
    // eslint-disable-next-line camelcase
    entity_params = {...form_filter_params, ...{ page: current_page.value, orderBy: 'created_at', sortedBy: 'desc' }}
    getFarmerActivities(entity_params).then(response => {
      if (response.data.success) {
        farmActivities.value = response.data.data?.data
        pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page)
        total.value = response.data.data?.total
        per_page.value = response.data.data?.per_page
        isLoading.value = false
      }
      else {
        isLoading.value = false
        console.log(response)
      }
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

const selectedTotal = computed(() => {
  console.log('Selected UUIDs:', selected.value)
  return farmActivities.value
    .filter(activity => selected.value.includes(activity.id))
    .reduce((total, activity) => total + (Number(activity.activity_items_sum_total) || 0), 0)
})

const openSiteVisitDialog = fai => {
  farm_activity_id.value = fai
  site_visit_dialog.value = true
}

onMounted(() => {
  fetchData()
})

const filterList = filterForm => {
  // eslint-disable-next-line camelcase
  form_filter_params = filterForm;
  current_page.value = 1
  selected.value = []
  fetchData()
}

const headers = [
  { title: 'FARMER NAME', key: 'farmer' },
  { title: 'FARM', key: 'farm' },
  { title: 'COHORT', key: 'cohort' },
  { title: 'OFFTAKER', key: 'offtaker' },
  { title: 'AMOUNT', key: 'activity_items_sum_total' },
  { title: 'CREATED DATE', key: 'created_at' },
  { title: 'STATUS', key: 'status' },
  { title: 'ACTION', key: 'action' },
]

const formattedRateCards = computed<RateCard[]>(() => {
  return farmActivities.value.map(farmActivity => ({
    ...farmActivity,
    farmer: `${farmActivity.farm.user.first_name} ${farmActivity.farm.user.middle_name} ${farmActivity.farm.user.last_name}`,
    cohort: farmActivity.cohort.name,
    offtaker: `${farmActivity.offtaker?.first_name}  ${farmActivity.offtaker?.middle_name} ${farmActivity.offtaker?.last_name}`,
    farm: `${farmActivity.farm?.location}` + `, ${`${farmActivity.farm?.size} `.trim()}`,
    created_at: formatDate(farmActivity.created_at),
  }))
})

const deleteFarmActivity = async uuid => {
  try {
    removeFarmActivity(uuid).then(response => {
      if (response.data.success)
        toast.success(response.data.message)

      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const approveSelectedActivities = () => {
  approveActivitiesDialog.value = true
}

const getColor = status => {

  if (status.code === 'APPROVED')
    return 'success'
  else return 'default'
}


</script>

<template>
  <ApproveFarmActivityModal
    :dialog="approveActivitiesDialog"
    :activities="selected"
    description="The selected farm activities will be approved and loan will be activated."
    title="Approve Farm Activities"
    :activity="{}"
    multiple
    @update:dialog="approveActivitiesDialog = $event"
    @refresh="fetchData"
  />

  <VCard>
    <VCardItem>
      <VCardTitle>Farmer Activities List</VCardTitle>
      <template #append>

        <ListFilter
          filter_farmer
          filter_cohort
          :filter_system_user="false"
          filter_offtaker
          :filter_first_name="false"
          :filter_middle_name="false"
          :filter_last_name="false"
          :filter_phone_number="false"
          :filter_email="false"
          filter_center
          filter_date
          title="Filter Farm Activity List"
          @on-filter="filterList" />
        <!-- Add this new template for the header -->

        <VMenu>
          <template #activator="{ props }">
            <VBtn
              v-bind="props"
              variant="tonal"
              icon="bx bx-dots-vertical-rounded"
            />
          </template>
          <VList>
            <VListItem
              color="warning"
              @click="approveSelectedActivities"
            >
              <IconBtn> <VIcon icon="bx bx-check-double" /> </IconBtn>Approve Activities
            </VListItem>
          </VList>
        </VMenu>
        <VBtn
          v-if="hasPermission('create.farm_activity')"
          class="ms-2"
          size="small"
          color="info"
          prepend-icon="bx bx-plus"
          href="/form/farm-activity"
        >
          Add Farmer Activity
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.farm_activity')"
      v-model="selected"
      :headers="headers"
      :items="formattedRateCards"
      :items-per-page="per_page"
      height="800"
      show-select
      :sortable="false"
      fixed-header
    >
      <template #top>
        <div class="flex">
          <VChip color="primary" class="ma-2">
            Selected Total: {{ selectedTotal.toFixed(2) }}
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
            Total: {{ total }}
          </VChip>
        </VRow>
      </template>
      <template #item.status="{ value }">
        <VChip :color="getColor(value)">
          {{ value.name }}
        </VChip>
      </template>
      <template #item.action="{ item }">
        <VMenu>
          <template #activator="{ props }">
            <VBtn
              v-bind="props"
              variant="tonal"
              icon="bx bx-dots-vertical-rounded"
            />
          </template>
          <VList>
            <VListItem
              v-if="hasPermission('view.farm_activity')"
              :href="`/view/farmer-activity/${item.id}`"
            >
              <IconBtn> <VIcon icon="bx bx-search-alt-2" /> </IconBtn>Manage Activity
            </VListItem>
            <VListItem
              v-if="hasPermission('edit.farm_activity') && item.status.code === 'PENDING'"
              :href="`/form/farm-activity/${item.id}`"
            >
              <IconBtn> <VIcon icon="bx bx-edit-alt" /> </IconBtn>Edit Activity
            </VListItem>
            <VListItem
              v-if="hasPermission('create.site_visit')"
              @click="openSiteVisitDialog(item.id)"
            >
              <IconBtn> <VIcon icon="bx bx-table" /> </IconBtn>Add Farm Visit
            </VListItem>
            <VListItem
              v-if="hasPermission('delete.farm_activity')"
              @click="deleteFarmActivity(`${item.id}`)"
            >
              <IconBtn>
                <VIcon
                  icon="bx bx-trash"
                  class="text-error"
                />
              </IconBtn><span class="text-error">Delete</span>
            </VListItem>
          </VList>
        </VMenu>
      </template>
    </VDataTable>
    <SiteVisitModal
      :dialog="site_visit_dialog"
      :farm_activity_id="farm_activity_id"
      @update:site_visit_dialog="site_visit_dialog = $event"
    />
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 80%);
  block-size: 100%;
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
}
</style>
