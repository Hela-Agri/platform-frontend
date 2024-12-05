<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCenters } from '@/api/center'
import { formatDate, hasPermission } from '@/utils'

interface Filter {
  [key: string]: any
}

interface Center {
  id: string
  name: string
  category: { name: string }
  unit: { name: string }
  pack_size: number
  description: string
  created_at: string
}

const isLoading = ref<boolean>(false)
const centers = ref<Center[]>([])
const pages = ref(0)
const per_page = ref(0)
const current_page = ref(1)
// eslint-disable-next-line camelcase
let entity_params: Filter = {}

const fetchData = async (): Promise<void> => {
  isLoading.value = true

  try {
    entity_params = { page: current_page.value, orderBy: 'name', sortBy: 'asc' }

    const response = await getCenters(entity_params)

    centers.value = response.data.data?.data
    pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page)
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
  { title: 'NAME', key: 'name' },
  { title: 'DESCRIPTION', key: 'description' },
  { title: 'No. of Cohorts', key: 'cohorts_count' },
  { title: 'No. of Farmers', key: 'farmers_count' },
  { title: 'CREATED DATE', key: 'created_at' },
  { title: 'ACTION', key: 'action' },

]

const formattedCenters = computed<Center[]>(() => {
  return centers.value?.map(center => ({
    ...center,
    created_at: formatDate(center.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Centers List</VCardTitle>
      <template #append>
        <VBtn
          class="ms-3"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/center"
        >
          Add Center
        </VBtn>
      </template>
    </VCardItem>
  </VCard>

  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.center')"
      :headers="headers"
      :items="formattedCenters"
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
              v-if="hasPermission('edit.center')"
              :href="`/form/center/${item.id}`"
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
