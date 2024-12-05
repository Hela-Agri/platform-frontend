<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLoanProducts } from '../../api/loan'
import { formatDate, hasPermission } from '@/utils'

interface Filter {
  [key: string]: any
}

interface LoanProduct {
  id: string
  name: string
  duration: number
  rate_type: number
  rate: number
  created_at: number
}
const pages=ref(0);
const per_page=ref(0);
const current_page= ref(1);
const isLoading = ref<boolean>(false)
const LoanProducts = ref<LoanProduct[]>([])
let entity_params: Filter = {}
const fetchData = async (filter?: Filter, page?: number): Promise<void> => {
  isLoading.value = true

  try {
  entity_params={page:current_page.value,orderBy:'name',sortBy:'asc'}
  const response = await fetchLoanProducts(entity_params)

    LoanProducts.value = response.data.data.data
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
  { title: 'NAME', key: 'name' },
  { title: 'DURATION (Days)', key: 'duration' },
  { title: 'RATE TYPE', key: 'rate_type' },
  { title: 'RATE', key: 'interest_rate' },
  { title: 'PROCESSING FEE', key: 'processing_fee' },
  { title: 'CREATED DATE', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const formattedLoanProducts = computed<LoanProduct[]>(() => {
  return LoanProducts.value.map(loadProduct => ({
    ...loadProduct,
    created_at: formatDate(loadProduct.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Loan Products List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.loan_product')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/loan-product"
        >
          Add Loan Product
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.loan_product')"
      :headers="headers"
      :items="formattedLoanProducts"
      :items-per-page="10"
      height="auto"
      fixed-header
    >
      <template #item.action="{ item }">
        <VMenu>
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="tonal" icon="bx bx-dots-vertical-rounded" />
          </template>
          <VList>
            <VListItem :href="`/form/loan-product/${item.id}`">
              <IconBtn> <VIcon icon="bx bx-pencil" /> </IconBtn>Edit
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
