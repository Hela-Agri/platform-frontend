<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPayments } from '@/api/payment'
import { formatDate, hasPermission } from '@/utils'

interface Filter {
  [key: string]: any
}

interface Payment {
  name: string
  description: number
  created_at: number
}

const isLoading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const payments = ref<Payment[]>([])
const payment = ref<Payment[]>([])
const router = useRouter()
const per_page = ref(0);
const current_page = ref(1);
const pages = ref(0);
const total = ref(0);

interface Item {
  id: number | string
}

const completeDisbursement = (item: Item): void => {
  router.replace(`/complete/payment/${item.id}`)
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
    const response = await fetchPayments(entity_params, page ?? 1)
    payments.value = response.data.data.data
    pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page);
    total.value = response.data.data?.total;
    per_page.value = response.data.data?.per_page;
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
  { title: 'PAID AMOUNT', key: 'paid_amount' },
  { title: 'REMAINING BALANCE', key: 'balance' },
  { title: 'TRANSACTION REFERENCE', key: 'transaction_reference' },
  { title: 'PAYMENT MODE', key: 'payment_mode' },
  { title: 'TRANSACTION DATE', key: 'transaction_date' },
  { title: 'ACTION', key: 'action' },
]

const formattedPayments = computed<Payment[]>(() => {
  if (payments.value.length > 0) {
    return payments.value.map(payment => ({
      ...payment,
      payment_mode: `${payment?.payment_mode?.name}`,
      transaction_date: formatDate(payment.transaction_date),
    }))
  }
})

const viewPayment = item => {
  dialog.value = true
  payment.value = item
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Payments List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.payment')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/payment"
        >
          Add Payment
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.payment')"
      :headers="headers"
      :items="formattedPayments"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
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
          <VChip class="my-5 mx-5"> Total: {{ total }} </VChip>
        </VRow>
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
            <VListItem
              :href="`/view/payment/${item.id}`">
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
