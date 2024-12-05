<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {toast} from 'vue3-toastify'
import {fetchFarms, getFarmerActivity, getFarmers, updateFarmerActivity} from '@/api/farmer'
import {router} from '@/plugins/router'
import {fetchUsers} from "@/api/user";
import {getCohorts} from "@/api/cohort";
import {fetchLoanProducts} from "@/api/loan";
const loan_products = ref([])
const users = ref([])
const cohorts = ref([])
const farms = ref([])
const farmers = ref([])
const isLoading = ref(false)

const farmActivityForm = ref({
  id:'',
  user_id: '',
  farm_id: '',
  off_taker_id: '',
  cohort_id: '',
  load_product_id: '',
})

const loading = ref(false)
const route = useRoute()
const farm_id = [
  'fixed',
  'percentage',
]
const refFarmerActivityForm = ref()
const fetchFarmerActivity = async () => {
  loading.value = true
  try {
    getFarmerActivity(farmActivityForm.value.id).then(response => {
      if (response?.data?.success) {
        farmActivityForm.value.user_id=response?.data?.data?.user_id;
        farmActivityForm.value.farm_id=response?.data?.data?.farm_id;
        farmActivityForm.value.off_taker_id=response?.data?.data?.offtaker?.id;
        farmActivityForm.value.cohort_id=response?.data?.data?.cohort_id;
        farmActivityForm.value.load_product_id=response?.data?.data?.loan_package_id;

        const entity_params = {
          page: 1,
          orderBy: 'created_at',
          sortedBy: 'desc',
          search: farmActivityForm.value.user_id,
          searchFields: `id:like;`
        };

        fetchFarmers(entity_params)

        const params = {
          page: 1,
          orderBy: 'created_at',
          sortedBy: 'desc',
          search:  farmActivityForm.value.user_id,
          searchFields: `user_id:like;`
        };

        getFarms(params)

      }
      else { console.log(response) }
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}
onMounted(async () => {

  farmActivityForm.value.id = <string>route.params.uuid

  if(farmActivityForm.value.id){
    await fetchFarmerActivity();
  }

  await getLoanProducts();
  await fetchCohorts();
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
  };

  await fetchOffTakers(entity_params)

})
const submitForm = async () => {
  try {
    loading.value = true
    refFarmerActivityForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        updateFarmerActivity(farmActivityForm.value.id,{
          user_id: farmActivityForm.value.user_id,
          farm_id: farmActivityForm.value.farm_id,
          off_taker_id: farmActivityForm.value.farm_id,
          cohort_id: farmActivityForm.value.cohort_id,
          loan_package_id: farmActivityForm.value.load_product_id,
        }).then(async response => {
          loading.value = false
          if(response.data.success){
            toast.success(response.data.message)
            await router.replace('/list/farm-activities')
          }else{
            toast.error(response.data.message)
          }

        })
      } else {
        loading.value = false
        toast.error('Kindly fill in all required fields')
      }

    });
  }catch (error) {
    loading.value = false
    console.log(error)
  }
}

const requiredValidator = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value)
      return true

    return 'Field is required.'
  },
])

const filterFarmers = (item) => {

  const entity_params = {
    page: 1,
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
        farmers.value = response.data?.data?.data.map((farmer: any) => ({
          value: `${farmer.id}`,
          label: `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name} - (${farmer.phone_number})`.trim(),
        }));
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

const filterOffTakers = (item) => {

  const entity_params = {
    page: 1,
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
        users.value = response.data?.data?.data.map((user: any) => ({
          value: `${user.id}`,
          label: `${user.first_name} ${user.middle_name} ${user.last_name} - (${user.phone_number})`.trim(),
        }));
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

const farmSearcher = id => {
  const entity_params = {
    orderBy: 'created_at',
    sortedBy: 'desc',
    search: id,
    searchFields: `user_id`
  };

  getFarms (entity_params)
}

const getFarms = async entity_params => {
  try {
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

</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Edit Farmer Activity Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm  ref="refFarmerActivityForm"  @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Loan Product Name -->


            <VCol
              cols="12"
              md="6"
            >
              <VLabel>Select Farmer</VLabel>
              <el-select-v2
                v-model="farmActivityForm.user_id"
                filterable
                disabled
                clearable
                :options="farmers"
                @change="farmSearcher"
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
                :remote-method="filterOffTakers"
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


            <VCol
              cols="12"
              class="d-flex gap-4"
            >
              <VBtn
                :loading="loading"
                type="submit"
              >
                Submit
              </VBtn>

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                href="/list/loan-products"
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
