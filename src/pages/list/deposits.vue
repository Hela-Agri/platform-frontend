<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchDeposits } from '@/api/deposit'
import { formatDate, hasPermission } from '@/utils'
import ViewDepositModal from '@/pages/modals/viewDepositModal.vue'

interface Filter {
  [key: string]: any
}

interface Deposit {
  name: string
  description: number
  created_at: string
  date: string
}

const isLoading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const deposits = ref<Deposit[]>([])
const deposit = ref<Deposit[]>([])

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
    const response = await fetchDeposits(entity_params, page ?? 1)

    deposits.value = response.data.data.data
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
  { title: 'OFF TAKER NAME', key: 'name' },
  { title: 'REQUESTED AMOUNT', key: 'amount' },
  { title: 'APPROVED AMOUNT', key: 'allowed_amount' },
  { title: 'STATUS', key: 'status' },
  { title: 'DATE', key: 'date' },
  { title: 'ACTION', key: 'action' },
]

const formattedDeposits = computed<Deposit[]>(() => {
  if (deposits.value.length > 0) {
    return deposits.value.map(deposit => ({
      ...deposit,
      status: `${deposit?.status?.code}`,
      name: `${deposit?.user?.first_name} ${deposit?.user?.middle_name} ${deposit?.user?.last_name}`,
      date: formatDate(deposit.date),
    }))
  }
})

const viewDeposit = item => {
  dialog.value = true
  deposit.value = item
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Deposits List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.deposit')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/deposit"
        >
          Add Deposit
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.deposit')"
      :headers="headers"
      :items="formattedDeposits"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
      <template #item.status="{ item }">
        <div v-if="item?.status === 'PENDING'">
          <VChip
            color="primary"
            class="font-weight-medium"
            size="small"
          >
            {{ item?.status }}
          </VChip>
        </div>
        <div v-if="item?.status === 'APPROVED'">
          <VChip
            color="success"
            class="font-weight-medium"
            size="small"
          >
            {{ item?.status }}
          </VChip>
        </div>
        <div v-if="item?.status === 'REJECTED'">
          <VChip
            color="danger"
            class="font-weight-medium"
            size="small"
          >
            {{ item?.status }}
          </VChip>
        </div>
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
            <VListItem @click="viewDeposit(item)">
              <IconBtn>
                <VIcon icon="bx bx-check-circle" />
              </IconBtn>View
            </VListItem>
          </VList>
        </VMenu>
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

  <ViewDepositModal
    :dialog="dialog"
    :deposit="deposit"
    @refresh-deposit="fetchData"
    @update:dialog="dialog = $event"
  />
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
