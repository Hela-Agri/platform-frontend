<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLoans } from '@/api/loan'
import {formatDate, getQuantityColorTagCode, hasPermission} from '@/utils'

interface Filter {
  [key: string]: any
}

interface Loan {
  name: string
  description: number
  created_at: number
}

const isLoading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const loans = ref<Loan[]>([])
const loan = ref<Loan[]>([])
const per_page = ref(0)
const current_page = ref(1)
const pages = ref(0)
const total = ref(0)
let entity_params: Filter = {}
let form_filter_params: Filter = {}

const fetchData = async () => {
  isLoading.value = true

  try {
    entity_params = {...form_filter_params, ...{ page: current_page.value, orderBy: 'created_at', sortedBy: 'desc' }}

    const response = await fetchLoans(entity_params)

    loans.value = response.data.data.data
    pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page)
    total.value = response.data.data?.total
    per_page.value = response.data.data?.per_page
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
  { title: 'LOAN CODE', key: 'code' },
  { title: 'FARMER NAME', key: 'farmer_name' },
  { title: 'OFF TAKER NAME', key: 'off_taker_name' },
  { title: 'SUB TOTAL', key: 'sub_total' },
  { title: 'INTEREST', key: 'interest' },
  { title: 'TOTAL', key: 'total' },
  { title: 'BALANCE', key: 'balance' },
  { title: 'STATUS', key: 'status' },
  { title: 'LOAN DATE', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const formattedLoans = computed<Loan[]>(() => {
  if (loans.value.length > 0) {
    return loans.value.map(loan => ({
      ...loan,
      status: `${loan?.status?.code}`,
      farmer_name: `${loan?.farmer?.first_name} ${loan?.farmer?.middle_name} ${loan?.farmer?.last_name}`,
      off_taker_name: `${loan?.wallet_transaction?.wallet?.off_taker?.first_name} ${loan?.wallet_transaction?.wallet?.off_taker?.middle_name} ${loan?.wallet_transaction?.wallet?.off_taker?.last_name}`,
      created_at: formatDate(loan.created_at),
    }))
  }
})

const viewLoan = item => {
  console.log(item)
  dialog.value = true
  loan.value = item
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Loans List</VCardTitle>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.loan')"
      :headers="headers"
      :items="formattedLoans"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
      <template #item.status="{ item }">
        <VChip :color="getQuantityColorTagCode(item.status)">
          {{ item.status }}
        </VChip>
      </template>
      <!-- actions -->
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
            <VListItem @click="viewLoan(item)">
              <IconBtn>
                <VIcon icon="bx bx-check-circle" />
              </IconBtn>View
            </VListItem>
            <VListItem @click="viewLoan(item)">
              <IconBtn>
                <VIcon icon="bx bx bx-printer" />
              </IconBtn>Print Statement
            </VListItem>
          </VList>
        </VMenu>
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
            Total Count: {{ total }}
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
