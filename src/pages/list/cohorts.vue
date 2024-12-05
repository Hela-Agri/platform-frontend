<script setup lang="ts">
import { removeCohort } from '@/api/cohort'
import { onMounted, ref } from 'vue'
import { getCohorts } from '@/api/cohort'
import { formatDate, hasPermission } from '@/utils'
import { toast } from "vue3-toastify"
import CohortLoanReportModal from "@/pages/modals/cohortLoanReportModal.vue";
import LoanApprovalDateModal from "@/pages/modals/LoanApprovalDateModal.vue";

interface Filter {
  [key: string]: any
}

interface Cohort {
  name: string
  description: number
  created_at: number
}
const loanApprovalDialog = ref(false)
const selectedItemId = ref<string | number>('')
const isLoading = ref<boolean>(false)
const Cohorts = ref<Cohort[]>([])
const cohort = ref<Cohort[]>([])
const dialog = ref(false)
const title = ref('')
const openLoanApprovalModal = (item) => {
  selectedItemId.value = item.id
  loanApprovalDialog.value = true
}

const fetchData = async (filter?: Filter, page?: number): Promise<void> => {
  isLoading.value = true

  // eslint-disable-next-line camelcase
  let entity_params: Filter = {}
  try {
    if (filter === undefined) {
      // eslint-disable-next-line camelcase
      entity_params = {}
    }
    else {
      // eslint-disable-next-line camelcase
      entity_params = filter
    }
    const response = await getCohorts(entity_params, page ?? 1)

    Cohorts.value = response.data.data.data
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

const  cohortReport = item => {
  title.value = `${item.name} LOAN REPORT`
  dialog.value = true
  cohort.value = item
}

onMounted(() => {
  fetchData()
})
const deleteCohort = async uuid => {
  try {
    removeCohort(uuid).then(response => {
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
const headers = [
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'DURATION (Days)', key: 'duration' },
  { title: 'CREATED DATE', key: 'created_at' },
  { title: 'ACTIVITY COUNT', key: 'farm_activities_count' },
  { title: 'ACTION', key: 'action' },
]

const formattedCohorts = computed<Cohort[]>(() => {
  return Cohorts.value.map(cohort => ({
    ...cohort,
    created_at: formatDate(cohort.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Cohorts List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.cohort')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/cohort"
        >
          Add Cohort
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.cohort')"
      :headers="headers"
      :items="formattedCohorts"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
      <template v-slot:item.farm_activities_count="{ value }">
        <v-chip>
          {{ value }}
        </v-chip>
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
              v-if="hasPermission('edit.cohort')"
              :href="`/form/cohort/${item.id}`"
            >
              <IconBtn> <VIcon icon="bx bx-pencil" /> </IconBtn>Edit
            </VListItem>
            <VListItem
              @click="cohortReport(item)"
            >
              <IconBtn> <VIcon icon="bx bxl-deezer"/> </IconBtn
              ><span>Loan Report</span>
            </VListItem>
            <VListItem @click="openLoanApprovalModal(item)">
              <IconBtn> <VIcon icon="bx bx-calendar" /> </IconBtn>
              <span>Set Loan Approval Date</span>
            </VListItem>
            <VListItem
              v-if="hasPermission('delete.cohort')"
              @click="deleteCohort(`${item.id}`)"
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
    <CohortLoanReportModal
      :dialog="dialog"
      :cohort="cohort"
      description="Select Date Range"
      :title="title"
      multiple
      @update:dialog="dialog = $event"
      @refresh="fetchData"
    />
    <LoanApprovalDateModal
      :dialog="loanApprovalDialog"
      :item-id="selectedItemId"
      @update:dialog="loanApprovalDialog = $event"
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
