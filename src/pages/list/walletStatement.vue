<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getWalletStatements } from '@/api/report'
import { formatDate, hasPermission } from '@/utils'
import ListFilter from "@/pages/filter/ListFilter.vue";

interface Filter {
  [key: string]: any
}

interface Cohort {
  name: string
  description: number
  created_at: number
}

const isLoading = ref<boolean>(false)
const walletStatements = ref<Cohort[]>([])
const dialog = ref(false)
const title = ref('')
const credit = ref(0);
const balance = ref(0);
const debit = ref(0);
const per_page = ref(0);
const current_page = ref(1);
const pages = ref(0);
const total = ref(0);

let form_filter_params: Filter = {}
// eslint-disable-next-line camelcase
let entity_params: Filter = {}

const filterList = filterForm => {
  // eslint-disable-next-line camelcase
  form_filter_params = filterForm;
  entity_params = {...form_filter_params, ...{ page: current_page.value, orderBy: 'created_at', sortedBy: 'desc' }}
  fetchData(entity_params)
}

const fetchData = async (filter): Promise<void> => {
  isLoading.value = true

  try {

    const response = await getWalletStatements(filter)

    walletStatements.value = response.data.data
    pages.value = Math.ceil(response.data?.total / response.data?.per_page);
    total.value = response.data?.total;
    per_page.value = response.data?.per_page;
    balance.value = response.data.totals.balance
    debit.value = response.data.totals.debit
    credit.value = response.data.totals.credit
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  }

  fetchData(filter)
})

const headers = [
  { title: 'OFF TAKER NAME', key: 'off_taker' },
  { title: 'DEBIT', key: 'debit' },
  { title: 'CREDIT', key: 'credit' },
  { title: 'BALANCE', key: 'balance' },
  { title: 'RECORDED DATE', key: 'created_at' },
]

const formattedWalletStatements = computed<Cohort[]>(() => {
  return walletStatements.value.map(walletStatement => ({
    ...walletStatement,
    created_at: formatDate(walletStatement.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Wallet Transactions List</VCardTitle>
      <template #append>
        <ListFilter
          :filter_farmer="false"
          :filter_cohort="false"
          filter_offtaker
          :filter_system_user="false"
          :filter_first_name="false"
          :filter_middle_name="false"
          :filter_last_name="false"
          :filter_phone_number="false"
          :filter_email="false"
          title="Filter Activity Logs"
          @on-filter="filterList"
          :filter_center="false"
          filter_date
        />
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.withdraw')"
      :headers="headers"
      :items="formattedWalletStatements"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
      <template #top>
        <div class="flex">
          <VChip class="my-5 mx-5">
            Total Debit (KES): {{ debit }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total Credit (KES):  {{ credit }}
          </VChip>
          <VChip class="my-5 mx-5">
            Total Balance (KES):  {{ balance }}
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
            @update:model-value="filterList"
          />
          <VChip class="my-5 mx-5"> Total: {{ total }} </VChip>
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
