<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getServices } from '@/api/service'
import { getProducts } from '@/api/product'
import { addRateCard } from '@/api/rateCard'
import {toast} from "vue3-toastify";
import moment from 'moment';
import { router } from '@/plugins/router'
interface Record {
  id: string
  name: string
  amount?: number
  effectiveDate?: string
}

interface Filter {
  [key: string]: any
}
interface FilteredRecord {
  item_id: string
  amount: number
  effective_date: string
}

interface Service {
  id: string
  name: string
  description: number
  effective_date: number
}

interface Product {
  id: string
  name: string
  description: number
  effective_date: number
}

const isLoading = ref<boolean>(false)
const products = ref<Product[]>([])
const services = ref<Service[]>([])
const current_page= ref(1);
// eslint-disable-next-line camelcase
let entity_params: Filter = {}
const form = ref({
  item_type: '',
})

const fetchRecords = async (itemType: string): Promise<Record[]> => {
  // eslint-disable-next-line camelcase
  entity_params={page:current_page.value,orderBy:'name',sortBy:'asc',limit:1000}

  isLoading.value = true

  try {
    if (itemType === 'Service') {
      const response = await getServices(entity_params)

      services.value = response.data.data.data

      return services.value.map(service => ({
        id: service.id,
        name: service.name,
        amount: service.description,
        effectiveDate: service.effective_date,
      }))
    }
    else if (itemType === 'Product') {
      const response = await getProducts(entity_params)

      products.value = response.data.data.data

      return products.value.map(product => ({
        id: product.id,
        name: product.name,
        amount: product.description,
        effectiveDate: product.effective_date,
      }))
    }
    else {
      return []
    }
  }
  catch (error) {
    console.error(error)
    throw error
  }
  finally {
    isLoading.value = false
  }
}

// eslint-disable-next-line camelcase
const item_type = ref<string>('')
const type = ref<string>('')
const records = ref<Record[]>([])

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => (value ? true : 'Field is required.'),
])

watch(item_type, async (newType: string) => {
  type.value = newType
  if (newType) {
    try {
      records.value = await fetchRecords(newType)
    }
    catch (error) {
      console.error('Failed to fetch records:', error)
      records.value = []
    }
  }
  else {
    records.value = []
  }
})

const submitForm = async () => {
  const filteredRecords: FilteredRecord[] = records.value
    .filter(record => record.amount && record.effectiveDate)
    .map(record => ({
      item_id: record.id,
      amount: record.amount!,
      effective_date: moment(String(record.effectiveDate!)).format('YYYY-MM-DD hh:mm:ss'),
    }))

  if (filteredRecords.length > 0) {
    try {
      try {
        addRateCard({
          item_type: type.value,
          records: JSON.stringify(filteredRecords),
        }).then (response => {
          toast.success(response.data.message)
          router.replace('/list/rate-cards')
        })
      }
      catch (error) {
        console.log(error)
      }
    }
    catch (error) {
      console.error('Error submitting records:', error)
    }
  }
  else {
    console.warn('No valid records to submit.')
  }
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Rate Card Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm @submit.prevent="submitForm">
          <VRow>
            <VCol
              cols="12"
              md="12"
            >
              <VSelect
                v-model="item_type"
                label="Item Type"
                placeholder="Select Item type"
                :items="['Service', 'Product']"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>

            <VCol cols="12">
              <VTable>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Amount</th>
                    <th>Effective Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="record in records"
                    :key="record.id"
                  >
                    <td>{{ record.name }}</td>
                    <td>
                      <VTextField
                        v-model="record.amount"
                        type="number"
                        label="Amount"
                      />
                    </td>
                    <td>
                      <VTextField
                        v-model="record.effectiveDate"
                        type="date"
                        label="Effective Date"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCol>

            <VCol
              cols="12"
              class="d-flex gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>
              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                href="/list/rate_cards"
              >
                Back
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCol>
    </VCard>
  </VCard>
</template>

<style scoped>
/* Additional styles if needed */
</style>
