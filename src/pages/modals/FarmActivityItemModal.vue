<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { getRateCards } from '@/api/rateCard'
import { updateFarmerActivity } from '@/api/farmer'
import { formattedErrors } from '@/utils'
import moment from "moment";
import {VTextField} from "vuetify/components";

const props = defineProps<{
  dialog: boolean
  farmActivityItem: object
  activity: object
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh-farm-activity'): void
}>()

// Function to close the dialog
const closeDialog = () => {
  emit('update:dialog', false)
}

// eslint-disable-next-line camelcase
const rate_cards = ref([])
const isLoading = ref(false)
const farmFormList = ref<FarmForm[]>([])

interface FarmForm {
  id: string
  item_type: string
  quantity: ReturnType<typeof ref>
  price: string
  item_id: string
  total: string
  date: string
}

const generateFarmForm = async item => {
  const farmForm: FarmForm = {
    id: item?.id ?? '',
    item_type: item?.item_type ?? '',
    price: item?.rate_card?.amount ?? '',
    quantity: item?.quantity ?? ref(),
    item_id: item?.rate_card?.id ?? '',
    total: item?.total ?? '',
    date: item?.date ? moment(item?.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
  }

  farmFormList.value.push(farmForm)
}
interface Filter {
  [key: string]: any
}
const getRateCard = async (value: string) => {
  let entity_params: Filter = {}
  try {
    entity_params = { page: 1, orderBy: 'name', sortBy: 'asc', limit: 1000 }
    await getRateCards(entity_params).then(response => {
      if (response.data.success)
        // eslint-disable-next-line camelcase
        rate_cards.value = response.data?.data?.data
      else
        console.log(response)
    })
  } catch (error) {
    console.log(error)
  }
}

const getPriceOfItem = (itemId:string, index:number) => {
  // eslint-disable-next-line camelcase
  const selectedRateCard = rate_cards.value.find((card:any) => card.id === itemId)
  if (selectedRateCard)
    farmFormList.value[index].price = selectedRateCard?.amount
}

watch(
  () => farmFormList.value,
  newVal => {
    newVal.forEach(farmForm => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      farmForm.total = String(calculateTotal(farmForm.price, farmForm.quantity))
    })
  },
  { deep: true },
)

watch(
  () => props.farmActivityItem,
  async newVal => {
    farmFormList.value = []
    await getRateCard(newVal?.item_type)
    await generateFarmForm(newVal)
  },
  { deep: true },
)

const calculateTotal = (price:any, quantity:any) => {
  if (price && quantity)
    return price * quantity

  return 0
}

function addFarmRow() {
  generateFarmForm({})
}

const FarmItemsPayload = () => {
  const items: { id: string; item_type: string; price: string; quantity: unknown; item_id: unknown; total: unknown, date:unknown }[] = []

  farmFormList.value.forEach(element => {
    items.push({
      id: props.farmActivityItem?.id,
      item_type: element.item_type,
      price: element.price,
      quantity: element.quantity,
      item_id: element.item_id,
      total: element.total,
      date: moment(String(element.date!)).format('YYYY-MM-DD hh:mm:ss'),
    })
  })

  return items
}

const submitData = () => {
  try {
    const payload = {
      farm_activity_items: FarmItemsPayload(),
    }
    updateFarmerActivity(props.activity.id, payload).then(async response => {
      if (response.status === 200) {
        toast.success(response.data.message)
        closeDialog()
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('refresh-farm-activity')
      }
      else {
        toast.error(formattedErrors(response.data.errors))
        closeDialog()
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

</script>

<template>
  <div class="pa-4 text-center">
    <VDialog
      v-model="props.dialog"
      max-width="1600"

    >
      <VCard
        min-height="500"
        :prepend-icon="props.farmActivityItem?.id?.length > 0 ? 'bx bx-pencil' : 'bx bx-plus'"
        :title="props.farmActivityItem?.id?.length > 0 ? 'Edit Farm Activity' : 'Add Farm Activity Item(s)'"
      >

        <VCardText>
          <VForm @submit.prevent="submitData">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Farm Items
                </h6>
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <VTable>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Item Type
                      </th>
                      <th class="text-left">
                        Item
                      </th>
                      <th class="text-left">
                        Price
                      </th>
                      <th class="text-left">
                        Quantity(s)
                      </th>
                      <th class="text-left">
                        Total
                      </th>
                      <th class="text-left">
                        Date Issued
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(farmForm, index) in farmFormList"
                      :key="index"
                    >
                      <td>
                        <VSelect
                          v-model="farmForm.item_type"
                          max-width="200px"
                          clearable
                          label="Select"
                          :items="[{ name: 'Product', value: 'product' }, { name: 'Service', value: 'service' }]"
                          item-title="name"
                          item-value="value"
                          @update:model-value="(value) => getRateCard(value)"
                        />
                      </td>
                      <td>
                        <el-select
                          style="width: 300px"
                          v-model="farmForm.item_id"
                          clearable
                          filterable
                          :teleported="false"
                          placeholder="Select"
                          height="400px"
                          @change="getPriceOfItem(farmForm.item_id,index)"
                        >
                          <el-option
                            v-for="item in rate_cards"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                      </td>
                      <td>
                        <VTextField
                          v-model="farmForm.price"
                          max-width="200px"
                          label="Price"
                          type="number"
                          readonly
                        />
                      </td>

                      <td>
                        <VTextField
                          v-model="farmForm.quantity"
                          max-width="200px"
                          label="Quantity"
                          type="number"
                          clearable
                        />
                      </td>

                      <td>
                        <VTextField
                          v-model="farmForm.total"
                          max-width="200px"
                          label="Total"
                          type="number"
                          readonly
                        />
                      </td>
                      <td>
                        <VTextField
                          type="date"
                          v-model="farmForm.date"
                          width="160px"
                        />

                      </td>
                    </tr>
                  </tbody>
                  <tfoot v-if="!props.farmActivityItem?.id?.length > 0">
                    <tr>
                      <td
                        colspan="8"
                        class="text-right"
                      >
                        <VBtn
                          type="button"
                          @click="addFarmRow"
                        >
                          Add Row
                          <VIcon
                            icon="bx-plus"
                            end
                            class="flip-in-rtl"
                          />
                        </VBtn>
                      </td>
                    </tr>
                  </tfoot>
                </VTable>
              </VCol>
            </VRow>
            <VDivider />
            <VCardActions>
              <VSpacer />
              <VSpacer />
              <VBtn
                text="Close"
                color="red"
                @click="closeDialog"
              />
              <VBtn type="submit">
                Submit
                <VIcon
                  icon="bx-save"
                  end
                  class="flip-in-rtl"
                />
              </VBtn>
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
