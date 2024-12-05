<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getServices } from '@/api/service'
import { formatDate, hasPermission } from '@/utils'

interface Filter {
  [key: string]: any
}

interface Service {
  id: string
  name: string
  description: number
  created_at: number
}

const isLoading = ref<boolean>(false)
const products = ref<Service[]>([])
const current_page= ref(1);
// eslint-disable-next-line camelcase
let entity_params: Filter = {}
const fetchData = async (filter?: Filter, page?: number): Promise<void> => {
  isLoading.value = true

  try {
    entity_params={page:current_page.value,orderBy:'name',sortBy:'asc'}
    const response = await getServices(entity_params)

    products.value = response.data.data.data
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
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'CREATED DATE', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const formattedProducts = computed<Service[]>(() => {
  return products.value.map(service => ({
    ...service,
    created_at: formatDate(service.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Services List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.service')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/service"
        >
          Add Service
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.service')"
      :headers="headers"
      :items="formattedProducts"
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
          <VListItem  v-if="hasPermission('edit.service')" :href="`/form/service/${item.id}`">
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
