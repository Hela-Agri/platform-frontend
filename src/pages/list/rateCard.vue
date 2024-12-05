<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getRateCards } from '@/api/rateCard'
import { formatDate, hasPermission } from '@/utils'
import {getProducts} from "@/api/product";
import {GenerateUrl} from "@/api/shared";

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

const isLoading = ref<boolean>(false)
const rateCards = ref<RateCard[]>([])
const pages=ref(0);
const per_page=ref(0);
const current_page= ref(1);
const fetchData = async (filter?: Filter, page?: number): Promise<void> => {
  isLoading.value = true

  // eslint-disable-next-line camelcase
  let entity_params: Filter = {}
  try {
    entity_params={page:current_page.value,orderBy:'name',sortBy:'asc'}
    const response = await getRateCards(entity_params)
    rateCards.value = response.data.data.data
    pages.value=Math.ceil(response.data.data?.total/response.data.data?.per_page);
    per_page.value=response.data.data?.per_page;
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
  { title: 'ITEM NAME', key: 'name' },
  { title: 'ITEM TYPE', key: 'item_type' },
  { title: 'AMOUNT', key: 'amount' },
  { title: 'EFFECTIVE DATE', key: 'effective_date' },
  { title: 'CREATED DATE', key: 'created_at' },
]

const formattedRateCards = computed<RateCard[]>(() => {
  return rateCards.value.map(rateCard => ({
    ...rateCard,
    effective_date: formatDate(rateCard.effective_date),
    created_at: formatDate(rateCard.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Rate Cards List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.rate_card')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/rate-card"
        >
          Add Rate Card
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.rate_card')"
      :headers="headers"
      :items="formattedRateCards"
      :items-per-page="per_page"
      height="500"
      fixed-header
    >
      <template v-slot:bottom >
        <VPagination
          v-model="current_page"
          class="my-2"
          :length="pages"
          :total-visible="5"
          @first="fetchData"
          @last="current_page = pages"
          @update:modelValue="fetchData"
        />
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
