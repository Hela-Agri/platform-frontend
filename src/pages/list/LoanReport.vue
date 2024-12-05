<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getLoans } from '@/api/report'
import {calculateDaysFromToday, formatDate, getQuantityColorTagCode, hasPermission} from '@/utils'
import ListFilter from '@/pages/filter/ListFilter.vue'

interface Filter {
  [key: string]: any
}

interface Loan {
  farmer: string
  contact: string
  farm: string
  center: string
  cohort: string
  start_date: string
  activity_items_sum_total: number
}

const isLoading = ref<boolean>(false)
const loans = ref<Loan[]>([])
const per_page = ref(0)
const current_page = ref(1)
const pages = ref(0)
const total = ref(0)
const totalLoan = ref(0)
const totalPrinciple = ref(0)
const totalInterest = ref(0)
const totalProcessing = ref(0)
const totalPaid = ref(0)
const totalBalance = ref(0)
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
    entity_params = { ...form_filter_params, ...{ page: current_page.value, orderBy: 'created_at', sortedBy: 'desc' } }

    const response = await getLoans(entity_params)

    pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page)
    total.value = response.data.data?.total
    per_page.value = response.data.data?.per_page
    loans.value = response.data?.data?.data
    totalPrinciple.value = response.data.data?.total_principle
    totalInterest.value = response.data.data?.total_interest
    totalProcessing.value = response.data.data?.total_processing_fee
    totalLoan.value = response.data.data?.total_loan
    totalPaid.value = response.data.data?.paid_total
    totalBalance.value = response.data.data?.balance_total
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
  { title: 'FARMER', key: 'farmer' },
  { title: 'PRINCIPLE', key: 'sub_total' },
  { title: 'PROCESSING FEE', key: 'processing_fee' },
  { title: 'INTEREST RATE', key: 'interest' },
  { title: 'AMOUNT(KES)', key: 'formatted_loan' },
  { title: 'PAID(KES)', key: 'sum_paid' },
  { title: 'BALANCE(KES)', key: 'balance' },
  { title: 'APPROVED DATE', key: 'date' },
  { title: 'OVERDUE', key: 'days_overdue' },
  { title: 'STATUS', key: 'expiry_status' },
  { title: 'PAYMENT STATUS', key: 'payment_status' },
  { title: 'CENTER', key: 'center' },
  { title: 'COHORT', key: 'cohort' },
  { title: 'FARM', key: 'farm' },

]

const formattedLoans = computed(() => {
  return loans.value?.map(loan => ({
    ...loan,
    expiry_status: `${loan?.status?.code}`,
    payment_status: `${loan?.payment_status?.code}`,
    sum_paid: loan?.loan_payments_sum_amount ?? 0,
    farmer: `${loan.farmer.first_name} ${loan.farmer.middle_name} ${loan.farmer.last_name}`.trim(),
    contact: loan.farmer.phone_number,
    farm: `${loan?.farm_activity?.farm?.location}, ${loan?.farm_activity?.farm?.size.trim()} ${loan?.farm_activity?.farm?.unit.name}`,
    center: loan?.farm_activity?.cohort?.center?.name ?? 'N/A',
    processing_fee: loan?.processing_fee ?? 0,
    cohort: loan?.farm_activity?.cohort.name,
    date: formatDate(loan.approval_date),
    overdue_days: calculateDaysFromToday(loan.maturity_date),
    maturity_date: formatDate(loan.maturity_date),
    formatted_loan: Number(loan.total ?? 0).toFixed(2),
    payments_sum_paid_amount: Number(loan?.payments_sum_paid_amount ?? 0).toFixed(2),
  }))
})
const getRowClass = (item: any) => {
  if (item?.status?.code === 'OVERDUE') {
    return 'overdue-row'
  }else{
    return ''
  }
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Loans List</VCardTitle>
      <template #append>
        <ListFilter
          filter_farmer
          filter_cohort
          filter_status
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
      :items="formattedLoans"
      :items-per-page="per_page"
      height="800"
      fixed-header
    >

      <template #item="{ item }">
        <tr :class="getRowClass(item)" variant="tonal" >
          <td v-for="header in headers" :key="header.key">
            <template v-if="header.key === 'expiry_status'">
              <VChip :color="getQuantityColorTagCode(item.expiry_status)">
                {{ item.expiry_status }}
              </VChip>
            </template>
            <template v-else-if="header.key === 'payment_status'">
              <VChip :color="getQuantityColorTagCode(item.payment_status)">
                {{ item.payment_status }}
              </VChip>
            </template>
            <template v-else-if="header.key === 'days_overdue'">
              <VRow
                v-if="item?.status?.code === 'OVERDUE'"
                class="mb-6 bg-white"
                height="50"
              >
              <span class="text-sm text-gray-500">
                {{ item.maturity_date }}
              </span>
                <span class="text-sm text-gray-500">
                ({{ item.overdue_days }} day(s))
              </span>
              </VRow>
            </template>
            <template v-else-if="header.key === 'farmer'">
              {{ item.farmer }}
              <p>{{ item.contact }}</p>
            </template>
            <template v-else>
              {{ item[header.key] }}
            </template>
          </td>
        </tr>
      </template>


      <template #item.farmer="{ item }">
        {{ item.farmer }}
        <p>{{ item.contact }}</p>
      </template>
      <template #top>
        <div class="flex">
          <VChip class="my-5 mx-5">
            Total No. of loan: {{ total }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total Principle(KES):  {{ totalPrinciple }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total Processing Fee(KES):  {{ totalProcessing }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total Interest (KES):  {{ totalInterest }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total (KES):  {{ totalLoan }}
          </VChip>
          <VChip class="my-5 mx-5">
            Paid (KES):  {{ totalPaid }}
          </VChip>
          <VChip class="my-5 mx-5">
            Balance (KES):  {{ totalBalance }}
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
.overdue-row {
  background-color: #FFEBEE; /* Very light red color */
}
</style>
