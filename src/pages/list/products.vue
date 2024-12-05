<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getProducts } from '@/api/product'
import { formatDate, hasPermission } from '@/utils'
import UploadProductsModal from '@/pages/modals/uploadProductsModal.vue'

interface Filter {
  [key: string]: any
}

interface Product {
  id: string
  name: string
  category: { name: string }
  unit: { name: string }
  pack_size: number
  description: string
  created_at: string
}
const product_upload_dialog = ref(false)
const isLoading = ref<boolean>(false)
const products = ref<Product[]>([])
const pages = ref(0)
const per_page = ref(0)
const current_page = ref(1)
// eslint-disable-next-line camelcase
let entity_params: Filter = {}

const fetchData = async (): Promise<void> => {
  isLoading.value = true

  try {
    entity_params = { page: current_page.value, orderBy: 'name', sortedBy: 'asc' }

    const response = await getProducts(entity_params)

    products.value = response.data.data?.data
    pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page)
    per_page.value = response.data.data?.per_page
    isLoading.value = false
  }
  catch (error) {
    console.log(error)
    isLoading.value = false
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
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'CATEGORY', key: 'category' },
  { title: 'PACK SIZE', key: 'pack_size' },
  { title: 'CREATED DATE', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const formattedProducts = computed<Product[]>(() => {
  return products.value?.map(product => ({
    ...product,
    created_at: formatDate(product.created_at),
  }))
})

const openUploadDialog = () => {
  product_upload_dialog.value = true
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Products List</VCardTitle>
      <template #append>
        <VBtn
          class="ms-3"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/product"
        >
          Add Product
        </VBtn>
        <VBtn
          v-if="hasPermission('create.product')"
          class="ms-3"
          size="small"
          color="secondary"
          prepend-icon="bx bx-upload"
          @click="openUploadDialog"
        >
          Upload Product
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <UploadProductsModal
    :dialog="product_upload_dialog"
    @update:product_upload_dialog="product_upload_dialog = $event"
  />
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.product')"
      :headers="headers"
      :items="formattedProducts"
      :items-per-page="per_page"
      height="500"
      fixed-header
    >
      <template #bottom>
        <VPagination
          v-model="current_page"
          class="my-2"
          :length="pages"
          :total-visible="5"
          @first="fetchData"
          @last="current_page = pages"
          @update:model-value="fetchData"
        />
      </template>
      <template #item.category="{ item }">
        <VChip>{{ item?.category?.name }}</VChip>
      </template>
      <template #item.pack_size="{ item }">
        {{ item?.pack_size }} {{ item?.unit?.name }}
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
              v-if="hasPermission('edit.product')"
              :href="`/form/product/${item.id}`"
            >
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
