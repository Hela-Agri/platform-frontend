<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchWithdrawals } from '@/api/deposit'
import { formatDate, hasPermission } from '@/utils'

interface Filter {
  [key: string]: any
}

interface Withdrawal {
  name: string
  description: number
  created_at: number
}

const isLoading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const withdrawals = ref<Withdrawal[]>([])
const withdrawal = ref<Withdrawal[]>([])
const search = ref([])

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
    const response = await fetchWithdrawals(entity_params, page ?? 1)

    withdrawals.value = response.data.data.data
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  search.value.type = 'debit'
  fetchData(search, 1)
})

const headers = [
  { title: 'WITHDRAWAL CODE', key: 'code' },
  { title: 'FARMER NAME', key: 'farmer_name' },
  { title: 'OFF TAKER NAME', key: 'off_taker_name' },
  { title: 'AMOUNT', key: 'amount' },
  { title: 'WITHDRAWAL DATE', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const formattedWithdrawals = computed<Withdrawal[]>(() => {
  if (withdrawals.value.length > 0) {
    return withdrawals.value.map(withdrawal => ({
      ...withdrawal,
      status: `${withdrawal?.status?.code}`,
      farmer_name: `${withdrawal?.farmer?.first_name} ${withdrawal?.farmer?.middle_name} ${withdrawal?.farmer?.last_name}`,
      off_taker_name: `${withdrawal?.wallet?.off_taker?.first_name} ${withdrawal?.wallet?.off_taker?.middle_name} ${withdrawal?.wallet?.off_taker?.last_name}`,
      created_at: formatDate(withdrawal.created_at),
    }))
  }
})

const viewWithdrawal = item => {
  console.log(item)
  dialog.value = true
  withdrawal.value = item
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Withdrawals List</VCardTitle>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.withdraw')"
      :headers="headers"
      :items="formattedWithdrawals"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
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
            <VListItem @click="viewWithdrawal(item)">
              <IconBtn>
                <VIcon icon="bx bx-check-circle" />
              </IconBtn>View
            </VListItem>
            <VListItem @click="viewWithdrawal(item)">
              <IconBtn>
                <VIcon icon="bx bx bx-printer" />
              </IconBtn>Print Statement
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
