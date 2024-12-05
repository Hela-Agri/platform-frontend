<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { addLoanProduct,getLoanProduct,updateLoanProduct } from '../../api/loan'
import { router } from '@/plugins/router'
import {getProduct} from "@/api/product";

const form = ref({
  id:'',
  name: '',
  duration: '',
  rate_type: '',
  interest_rate: '',
  processing_fee: '',
  processing_fee_desc: '',
})

const loading = ref(false)
const route = useRoute()
const rate_type = [
  'fixed',
  'percentage',
]
const refLoanProductForm = ref()
const fetchLoanProduct = async () => {
  loading.value = true
  try {
    getLoanProduct(form.value.id).then(response => {
      if (response?.data?.success) {
        form.value.name=response?.data?.data?.name;
        form.value.duration=response?.data?.data?.duration;
        form.value.rate_type=response?.data?.data?.rate_type;
        form.value.interest_rate=response?.data?.data?.interest_rate;
        form.value.processing_fee=response?.data?.data?.processing_fee;
        form.value.processing_fee_desc=response?.data?.data?.processing_fee_desc;
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

  form.value.id = <string>route.params.uuid

  if(form.value.id){//its an edit so get the current product to be editted
    await fetchLoanProduct();
  }

})
const submitForm = async () => {
  try {
    loading.value = true
    refLoanProductForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        if(form.value.id){
          updateLoanProduct(form.value.id,{
            name: form.value.name,
            duration: form.value.duration,
            rate_type: form.value.rate_type,
            interest_rate: form.value.interest_rate,
            processing_fee: form.value.processing_fee,
            processing_fee_desc: form.value.processing_fee_desc,
          }).then(async response => {
            loading.value = false
            await router.replace('/list/loan-products')
            if(response.data.success){
              toast.success(response.data.message)
            }else{
              toast.error(response.data.message)
            }

          })
        }else{
          addLoanProduct({
            name: form.value.name,
            duration: form.value.duration,
            rate_type: form.value.rate_type,
            interest_rate: form.value.interest_rate,
            processing_fee: form.value.processing_fee,
            processing_fee_desc: form.value.processing_fee_desc,
          }).then(async response => {
            loading.value = false
            await router.replace('/list/loan-products')
            toast.success(response.data.message)
          })
        }
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

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value)
      return true

    return 'Field is required.'
  },
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Loan Product Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm  ref="refLoanProductForm"  @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Loan Product Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Name"
                placeholder="Name"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.duration"
                label="Duration (Days)"
                placeholder="Duration (Days)"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="form.rate_type"
                :items="rate_type"
                :rules="[v => !!v || 'Iterest Rate is required']"
                label="Rate Type"
                validate-on="submit"
                placeholder="Rate Type"
                required
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.interest_rate"
                label="Interest Rate"
                placeholder="Interest Rate"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.processing_fee"
                label="Processing Fee"
                placeholder="Processing Fee"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.processing_fee_desc"
                label="Processing Fee Desc"
                placeholder="XYZ Fee(KES10.00),Bank Charges(KES20.00)"
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
