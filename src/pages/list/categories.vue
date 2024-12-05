<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCategories } from '@/api/category'
import { formatDate, hasPermission } from '@/utils'

interface Filter {
  [key: string]: any
}

interface Category {
  name: string
  description: number
  created_at: number
}

const isLoading = ref<boolean>(false)
const categories = ref<Category[]>([])

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
    await getCategories(entity_params, page ?? 1).then((response:any)=>{
      if(response.status==200){
        isLoading.value =false;
        categories.value = response.data.data.data
      }
    })


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
]

const formattedCategories = computed<Category[]>(() => {
  return categories.value.map(category => ({
    ...category,
    created_at: formatDate(category.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Categories List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.category')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/category"
        >
          Add Category
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <div class="table-container">
    <VDataTable
      v-if="hasPermission('list.category')"
      :headers="headers"
      :items="formattedCategories"
      :items-per-page="10"
      height="auto"
      fixed-header
    />
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
