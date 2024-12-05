<script lang="ts" setup>
// eslint-disable-next-line no-restricted-imports
import { VCardSubtitle, VCardTitle, VIcon, VRow, VTextField } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'
import {ref, UnwrapRef, watch} from 'vue'
import { toast } from 'vue3-toastify'
import { fetchLoanProducts } from '../../api/loan'
import { createFarmerActivity, fetchFarms, getFarmers } from '@/api/farmer'
import { getCohorts } from '@/api/cohort'
import { fetchUsers } from '@/api/user'
import { getRateCards } from '@/api/rateCard'
import { router } from '@/plugins/router'
import { formattedErrors } from '@/utils'
import moment from "moment/moment";

interface FarmForm {
  id: string
  item_type: string
  quantity: ReturnType<typeof ref>
  price: string
  item_id: string
  total: number
  date: string
}

const numberedSteps = [
  {
    title: 'Farm Activity Details',
    subtitle: 'Farm Activity',
    index: 0,
    icon: 'bx bxs-tree',
  },
  {
    title: 'Items',
    subtitle: 'Add farm items',
    index: 1,
    icon: 'bx bx-align-left',
  },
]


interface Filter {
  [key: string]: any
}

const farms = ref()
const cohorts = ref()
const users = ref([])
const farmers = ref([])
// eslint-disable-next-line camelcase
const loan_products = ref()
// eslint-disable-next-line camelcase
const rate_cards = ref()
const currentStep = ref(0)
const isCurrentStepValid = ref(true)
const refFarmerForm = ref()
const refFarmForm = ref()
const route = useRoute()
const isLoading = ref<boolean>(false)
const filter = ref({})
const rate_card_search = ref('')
let entity_params: Filter = {}
const current_page = ref(1)
const farmerForm = ref({
  id: '',
  user_id: '',
  farm_id: '',
  off_taker_id: '',
  cohort_id: '',
  load_product_id: '',
})

interface farmActivityForm {
  id: string,
  user_id: ReturnType<typeof ref>,
  farm_id: ReturnType<typeof ref>,
  off_taker_id: ReturnType<typeof ref>,
  cohort_id: ReturnType<typeof ref>,
  load_product_id: ReturnType<typeof ref>,
}

function addFarmRow() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  generateFarmForm()
}

onMounted(async () => {
  await generateFarmActivityForm()
  farmerForm.value.id = <string>route.params.uuid
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchFarmers({})
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchCohorts()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await getLoanProducts()

  filter.value.role_type = 'off_taker'
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchOffTakers(filter, 1)
})

const searchString = ref(''); // State variable to hold cumulative search string

const filterFarmers = (item) => {

  const entity_params = {
    page: current_page.value,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: item,
    searchFields: `first_name:like;last_name:like;middle_name:like;phone_number:like;`
  };

  fetchFarmers(entity_params)

};


const fetchFarmers = async (entity_params) => {
  isLoading.value = true
  try {
    getFarmers(entity_params).then(response => {
      if (response.data.success) {
        const tempFarmers = response.data?.data?.data.map((farmer:any) => ({
          value: `${farmer.id}`,
          label: `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name} - (${farmer.phone_number})`.trim(),
        }));
        farmers.value = tempFarmers;
      } else {
        console.log(response);
      }
    });

  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}
const filterOfftakers = (item) => {

  const entity_params = {
    page: current_page.value,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: item,
    searchFields: `first_name:like;last_name:like;middle_name:like;phone_number:like;`
  };

  fetchOffTakers(entity_params)

};
// eslint-disable-next-line @typescript-eslint/no-shadow
const fetchOffTakers = async (entity_params:any): Promise<void> => {
  isLoading.value = true

  // eslint-disable-next-line camelcase


  try {

    await fetchUsers(entity_params).then(response => {
      if (response.data.success) {
        const tempUers = response.data?.data?.data.map((user:any) => ({
          value: `${user.id}`,
          label: `${user.first_name} ${user.middle_name} ${user.last_name} - (${user.phone_number})`.trim(),
        }));
        users.value = tempUers;
      } else {
        console.log(response);
      }
    });
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
const fetchCohorts = async (filter?: Filter, page?: number): Promise<void> => {
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
    const response = await getCohorts(entity_params, page ?? 1)

    cohorts.value = response.data.data.data
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
const getLoanProducts = async (filter?: Filter, page?: number): Promise<void> => {
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
    const response = await fetchLoanProducts(entity_params, page ?? 1)

    // eslint-disable-next-line camelcase
    loan_products.value = response.data.data.data
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

const farmFormList = ref<FarmForm[]>([])

const generateFarmForm = async () => {
  const farmForm: FarmForm = {
    id:'',
    item_type: '',
    price: '',
    quantity: ref(),
    item_id: '',
    total: 0,
    date: moment().format('YYYY-MM-DD'),
  }

  farmFormList.value.push(farmForm)
}

const farmActivityList = ref<farmActivityForm[]>([])

const generateFarmActivityForm = async () => {
  const farmActivityForm: farmActivityForm = {
    id: '',
    user_id: ref(),
    farm_id: ref(),
    off_taker_id: ref(),
    cohort_id: ref(),
    load_product_id: ref(),
  }

  farmActivityList.value.push(farmActivityForm)
}
const farmActivitiesPayload = () => {
  const farmActivities: {
    id: string,
    user_id: unknown,
    farm_id: unknown,
    off_taker_id: unknown,
    cohort_id: unknown,
    load_product_id: unknown,
  }[] = []

  farmActivityList.value.forEach(element => {
    farmActivities.push({
      id: element.id,
      user_id: element.user_id,
      farm_id: element.farm_id,
      off_taker_id: element.off_taker_id,
      cohort_id: element.cohort_id,
      load_product_id: element.load_product_id
    })
  })

  return farmActivities
}

function addFarmActivityRow() {
  generateFarmActivityForm()
}
function removeFarmActivityRow(index: number) {
  farmActivityList.value.splice(index, 1)
}

const FarmItemsPayload = () => {
  const items: { item_type: string; price: string; quantity: unknown; item_id: string; total: number; date: string }[] = []

  farmFormList.value.forEach(element => {
    items.push({
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

const requiredValidator = ref([
  (value: any) => {
    return !!(value)
  },
])

const validatefarmerForm = () => {
  refFarmerForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else {
      isCurrentStepValid.value = false
    }
  })
}

const submitData = async () => {
  isLoading.value = false
  try {
    // Collect data from all forms
    const payload = {
      farm_activities: farmActivitiesPayload(),
      farm_activity_items: FarmItemsPayload(),

    }

    createFarmerActivity(payload).then(async response => {
      if (response.status === 200) {
        toast.success(response.data.message)
        await router.replace('/list/farm-activities')
      }else {
        toast.error(response.data.message)
      }
    }).catch((err)=>{
      toast.error(formattedErrors(err.data.message))
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

const validateFarmForm = () => {
  refFarmForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      isCurrentStepValid.value = true

      submitData()
    }
    else {
      isCurrentStepValid.value = false
    }
  })
}

const getFarms = async id => {
  try {
    const entity_params = {
      orderBy: 'created_at',
      sortedBy: 'desc',
      search: id,
      searchFields: `user_id`
    };
    fetchFarms(entity_params).then(response => {
      if (response.data.success) {
        farms.value = response.data?.data?.data.map((farm:any) => ({
          ...farm,
          name: `${farm?.location}` + `, ${`${farm?.size} `.trim()}`,
        }))
      }
      else {
        console.log(response)
      }
    })
  }
  catch (error) {
    console.log(error)
  }
}

const getPriceOfItem = (itemId:string, index:number) => {
  // eslint-disable-next-line camelcase
  const selectedRateCard = rate_cards.value.find((rate:any) => rate.id === itemId)
  if (selectedRateCard){
    farmFormList.value[index].price = selectedRateCard.amount;
    console.log(farmFormList.value[index].price);
  }

}

watch(
  () => farmFormList.value,
  newVal => {
    newVal.forEach(farmForm => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      farmForm.total = Number(String(calculateTotal(farmForm.price, farmForm.quantity)))
    })
  },
  { deep: true },
)

const calculateTotal = (price: UnwrapRef<FarmForm["price"]>, quantity: unknown) => {
  if (price && quantity)
    return price * quantity

  return 0
}

const fetchRateCards = (item_type: string) => {
  let entity_params: Filter = {}
  try {
    entity_params={page:1,orderBy:'name',type:item_type,sortBy:'asc',limit:1000}
    getRateCards(entity_params).then(response => {
      if (response.data.success)
        // eslint-disable-next-line camelcase
        rate_cards.value = response.data?.data?.data

      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <VCard>
    <VCardText>
      <VStepper
        v-model="currentStep"
        class="stepper-icon-step-bg"
        show-actions
        alt-labels
      >
        <VStepperHeader>
          <VStepperItem
            v-for="numberedStep in numberedSteps"
            :key="numberedStep.index"
            :value="numberedStep.index"
            class="narrow-stepper-item"
            editable
          >
            <template
              #icon
              rounded
            >
              <VIcon
                size="24"
                rounded
                :icon="numberedStep.icon"
                class="mx-2 my-2 px-2"
              />
            </template>
            <template #title>
              <VCol>
                <VCardTitle>{{ numberedStep.title }} </VCardTitle>
                <VCardSubtitle>{{ numberedStep.subtitle }}</VCardSubtitle>
              </VCol>
            </template>
          </VStepperItem>
        </VStepperHeader>
      </VStepper>

      <!-- 👉 stepper content -->

      <VWindow
        v-model="currentStep"
        class="disable-tab-transition mt-3"
      >
        <VWindowItem>
          <VForm
            ref="refFarmerForm"
            @submit.prevent="validatefarmerForm"
          >
            <VRow
              v-for="(farmActivityForm, index) in farmActivityList"
              :key="index"
              cols="12"
              class="justify-end"
            >
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Farmer Activity
                </h6>
                <p class="mb-0">
                  Fill farm activity details
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VLabel>Select Farmer</VLabel>
                <el-select-v2
                  v-model="farmActivityForm.user_id"
                  filterable
                  remote
                  clearable
                  :options="farmers"
                  @change="getFarms"
                  placeholder="Select Farmer"
                  style="width: 100%"
                  :remote-method="filterFarmers"
                >
                </el-select-v2>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VLabel>Select Farm</VLabel>
                  <VSelect
                  clearable
                  v-model="farmActivityForm.farm_id"
                  placeholder="kenya"
                  :items="farms"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VLabel>Select Off Taker</VLabel>

                <el-select-v2
                  v-model="farmActivityForm.off_taker_id"
                  filterable
                  remote
                  clearable
                  :options="users"
                  placeholder="Select Off Taker"
                  style="width: 100%"
                  :remote-method="filterOfftakers"
                >
                </el-select-v2>

              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VLabel>Select Cohort</VLabel>
                <VSelect
                  clearable
                  v-model="farmActivityForm.cohort_id"
                  :items="cohorts"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VLabel>Select Loan Product</VLabel>
                <VSelect
                  clearable
                  v-model="farmActivityForm.load_product_id"
                  :items="loan_products"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>
              <VBtn
                v-if="index > 0"
                color="error"
                density="compact"
                icon="bx-trash"
                @click="removeFarmActivityRow(index)"
              />
              <VDivider class="pa-2" />
            </VRow>

            <VCol cols="12">
              <VBtn

                class="float-end"
                size="x-small"
                type="button"
                rounded
                variant="outlined"
                @click="addFarmActivityRow"
              >
                Add Row
                <VIcon
                  icon="bx-plus"
                  end
                  class="flip-in-rtl"
                />
              </VBtn>
            </VCol>
            <VCol cols="12">
              <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                <VBtn
                  color="secondary"
                  variant="tonal"
                  disabled
                >
                  <VIcon
                    icon="bx-left-arrow-alt"
                    start
                    class="flip-in-rtl"
                  />
                  Previous
                </VBtn>

                <VBtn type="submit">
                  Next
                  <VIcon
                    icon="bx-right-arrow-alt"
                    end
                    class="flip-in-rtl"
                  />
                </VBtn>
              </div>
            </VCol>

          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refFarmForm"
            @submit.prevent="validateFarmForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Farm Items
                </h6>
                <p class="mb-0">
                  Add farm items
                </p>
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
                        Price(KES)
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
                          clearable
                          v-model="farmForm.item_type"
                          max-width="150px"
                          width="150px"
                          label="Select"
                          :items="[{ name: 'Product', value: 'product' }, { name: 'Service', value: 'service' }]"
                          item-title="name"
                          item-value="value"
                          @update:model-value="(value) => fetchRateCards(value)"
                        />
                      </td>
                      <td>
                         <el-select
                           style="width: 300px"
                          v-model="farmForm.item_id"
                          clearable
                          filterable
                          placeholder="Select"
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
                          width="100px"
                          type="number"
                          readonly
                        />
                      </td>

                      <td>
                        <VTextField
                          v-model="farmForm.quantity"
                          width="150px"
                          type="number"
                          clearable
                        />
                      </td>

                      <td>
                        <VTextField
                          v-model="farmForm.total"
                          width="100px"
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
                  <tfoot>
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

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="bx-left-arrow-alt"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Submit
                    <VIcon
                      icon="bx-save"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>

<style scoped>
.narrow-stepper-item {
  margin-left: 8px; /* Adjust as needed */
  margin-right: 8px; /* Adjust as needed */
}
</style>
