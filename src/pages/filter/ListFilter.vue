<script setup lang="ts">
import {ref} from 'vue'
import {VDateInput} from 'vuetify/labs/VDateInput'
import {getCenters} from '@/api/center'
import {getFarmers} from '@/api/farmer'
import {getCohorts} from '@/api/cohort'
import {fetchUsers} from '@/api/user'
import {getStatus} from '@/api/shared'
import moment from 'moment'

const props = defineProps<{
  title: string
  filter_farmer: boolean
  filter_cohort: boolean
  filter_status: boolean
  filter_offtaker: boolean
  filter_system_user: boolean
  filter_first_name: boolean
  filter_middle_name: boolean
  filter_last_name: boolean
  filter_phone_number: boolean
  filter_email: boolean
  filter_center: boolean
  filter_date: boolean
}>()

const emit = defineEmits<{
  (e: 'onFilter', value: File): void
}>()

const menu = ref(false)
const screenWidth = ref(window.innerWidth * 0.9)
const isLoading = ref<boolean>(false)
const cohorts = ref([])
const users = ref([])
const status = ref([])
const farmers = ref([])
const centers = ref([])

const form = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  status_id: '',
  phone_number: '',
  user_id: '',
  email: '',
  cohort_id: '',
  off_taker_id: '',
  farmer_id: '',
  center_id: '',
  start_date: '',
  end_date: '',
})

const filterList = async () => {
  try {

    const dates = dateRange.value.map(date => new Date(date))
    form.value.start_date = moment(dates[0]).format('YYYY-MM-DD')
    form.value.end_date = moment(dates[dates.length - 1]).format('YYYY-MM-DD')

    emit('onFilter', form.value)
    menu.value = false
  }
  catch (e) {
    console.error(e)
  }
}

const clearFilter = () => {
  form.value = {
    first_name: '',
    middle_name: '',
    last_name: '',
    status_id: '',
    phone_number: '',
    email: '',
    cohort_id: '',
    off_taker_id: '',
    farmer_id: '',
    center_id: '',
    start_date: '',
    end_date: '',
  }
  menu.value = false
}

const closeFilter = () => {
  form.value = {
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    cohort_id: '',
    off_taker_id: '',
    status_id: '',
    farmer_id: '',
    center_id: '',
    start_date: '',
    end_date: '',
  }
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  dateRange.value = [startOfMonth, endOfMonth]

}

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth * 0.9
}

const fetchStatus = async entity_params => {
  isLoading.value = true
  try {
    getStatus(entity_params).then(response => {
      if (response.data.success) {
        status.value = response.data?.data?.data.map((state: any) => ({
          value: `${state.id}`,
          label: `${state.code}`.trim(),
        }))
      }
      else {
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

const fetchFarmers = async entity_params => {
  isLoading.value = true
  try {
    getFarmers(entity_params).then(response => {
      if (response.data.success) {
        farmers.value = response.data?.data?.data.map((farmer: any) => ({
          value: `${farmer.id}`,
          label: `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name} - (${farmer.phone_number})`.trim(),
        }))
      }
      else {
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

const filterFarmers = item => {
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: item,
    searchFields: 'first_name:like;last_name:like;middle_name:like;phone_number:like;',
  }

  fetchFarmers(entity_params)
}

const filterStatus = item => {
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: item,
    searchFields: 'name:like;code:like;',
  }

  fetchStatus(entity_params)
}

const fetchCohorts = async entity_params => {
  isLoading.value = true
  try {
    getCohorts(entity_params).then(response => {
      if (response.data.success) {
        cohorts.value = response.data?.data?.data.map((cohort: any) => ({
          value: `${cohort.id}`,
          label: `${cohort.name}`.trim(),
        }))
      }
      else {
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

const filterCohorts = item => {
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: item,
    searchFields: 'name:like;',
  }

  fetchCohorts(entity_params)
}

const fetchCenters = async entity_params => {
  isLoading.value = true
  try {
    getCenters(entity_params).then(response => {
      if (response.data.success) {
        centers.value = response.data?.data?.data.map((center: any) => ({
          value: `${center.id}`,
          label: `${center.name}`.trim(),
        }))
      }
      else {
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

const filterCenters = item => {
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: item,
    searchFields: 'name:like;',
  }

  fetchCenters(entity_params)
}

const fetchOffTakers = async (entity_params: any): Promise<void> => {
  isLoading.value = true

  try {
    await fetchUsers(entity_params).then(response => {
      if (response.data.success) {
        users.value = response.data?.data?.data.map((user: any) => ({
          value: `${user.id}`,
          label: `${user.first_name} ${user.middle_name} ${user.last_name} - (${user.phone_number})`.trim(),
        }))
      }
      else {
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

const filterOfftakers = search => {
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search,
    searchFields: 'first_name:like;last_name:like;middle_name:like;phone_number:like;',
  }

  fetchOffTakers(entity_params)
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth)
})

// Watch for changes in the dialog prop
watch(() => menu, newValue => {
  if (newValue) {
    initializeDateRange()
    console.log('here now')
  }
})

const dateRange = ref([])

const initializeDateRange = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  dateRange.value = [startOfMonth, endOfMonth]
}
</script>

<template>
  <VCol>
    <VMenu
      v-model="menu"
      :close-on-content-click="false"
      location="end"
    >
      <template #activator="{ props }">
        <VBtn
          variant="tonal"
          v-bind="props"
          icon="bx bx-filter-alt"
        />
      </template>
      <VForm @submit.prevent="filterList">
        <VCard :min-width="`${screenWidth}px`">
          <VCardTitle>{{ props.title }}</VCardTitle>

          <VRow class="ms-1">
            <VCol
              v-if="props.filter_first_name"

              cols="12"
              md="3"
            >
              <VTextField
                v-model="form.first_name"
                placeholder="First Name"
                clearable
              />
            </VCol>
            <VCol
              v-if="props.filter_middle_name"

              cols="12"
              md="3"
            >
              <VTextField
                v-model="form.middle_name"
                placeholder="Middle Name"
                clearable
              />
            </VCol>
            <VCol
              v-if="props.filter_last_name"

              cols="12"
              md="3"
            >
              <VTextField
                v-model="form.last_name"
                placeholder="Last Name"
                clearable
              />
            </VCol>
            <VCol
              v-if="props.filter_phone_number"

              cols="12"
              md="3"
            >
              <VTextField
                v-model="form.phone_number"
                placeholder="Phone Number"
                clearable
              />
            </VCol>
            <VCol
              v-if="props.filter_center"

              cols="12"
              md="3"
            >
              <VLabel>Select Center</VLabel>

              <ElSelectV2
                v-model="form.center_id"
                filterable
                remote
                clearable
                :options="centers"
                placeholder="Select Center"
                style="width: 100%"
                :teleported="false"
                :remote-method="filterCenters"
              />
            </VCol>
            <VCol
              v-if="props.filter_cohort"

              cols="12"
              md="3"
            >
              <VLabel>Select Cohort</VLabel>

              <ElSelectV2
                v-model="form.cohort_id"
                filterable
                remote
                clearable
                :options="cohorts"
                placeholder="Select Cohort"
                style="width: 100%"
                :teleported="false"
                :remote-method="filterCohorts"
              />
            </VCol>
            <VCol
              v-if="props.filter_status"
              cols="12"
              md="3"
            >
              <VLabel>Select Status</VLabel>

              <ElSelectV2
                v-model="form.status_id"
                filterable
                remote
                clearable
                :options="status"
                placeholder="Select Status"
                style="width: 100%"
                :teleported="false"
                :remote-method="filterStatus"
              />
            </VCol>
            <VCol
              v-if="props.filter_farmer"
              cols="12"
              md="3"
            >
              <VLabel>Select Farmer</VLabel>

              <ElSelectV2
                v-model="form.farmer_id"
                filterable
                remote
                clearable
                :options="farmers"
                placeholder="Select Farmer"
                style="width: 100%"
                :teleported="false"
                :remote-method="filterFarmers"
              />
            </VCol>
            <VCol
              v-if="props.filter_offtaker"
              cols="12"
              md="3"
            >
              <VLabel>Select Off Taker</VLabel>

              <ElSelectV2
                v-model="form.off_taker_id"
                filterable
                remote
                clearable
                :teleported="false"
                :options="users"
                placeholder="Select Off Taker"
                style="width: 100%"
                :remote-method="filterOfftakers"
              />
            </VCol>
            <VCol
              v-if="props.filter_date"
              cols="12"
              md="3"
            >
              <VDateInput
                v-model="dateRange"
                prepend-icon=""
                multiple="range"
                clearable
                label="Select Date Range"
              />
            </VCol>
            <VCol
              v-if="props.filter_system_user"
              cols="12"
              md="3"
            >
              <VLabel>Select User</VLabel>

              <ElSelectV2
                v-model="form.user_id"
                filterable
                remote
                clearable
                :teleported="false"
                :options="users"
                placeholder="Select User"
                style="width: 100%"
                :remote-method="filterOfftakers"
              />
            </VCol>
          </VRow>

          <VCardActions class="float-left">
            <VSpacer />
            <VBtn
              color="red"
              variant="text"
              @click="closeFilter"
            >
              Cancel
            </VBtn>
            <VBtn
              color="primary"
              variant="text"
              type="submit"
            >
              Filter
            </VBtn>
          </VCardActions>
        </VCard>
      </VForm>
    </VMenu>
  </VCol>
</template>

<style scoped>
</style>
