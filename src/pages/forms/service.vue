<script lang="ts" setup>
import { ref } from 'vue'
import {addService, updateService, getService} from '@/api/service'
import { router } from '@/plugins/router'
import {toast} from "vue3-toastify";

const form = ref({
  id: '',
  name: '',
  description: '',
})
const loading = ref<boolean>(false)
const route = useRoute()
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})
const fetchService = async () => {
  loading.value = true
  try {
    getService(form.value.id).then(response => {
      if (response?.data?.success) {
        form.value.name=response?.data?.data?.name;
        form.value.description=response?.data?.data?.description;
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
    await fetchService();
  }

})
const submitForm = async () => {
  try {
   if(form.value.id){
     await updateService(form.value.id,{
       name: form.value.name,
       description: form.value.description,
     }).then(async response => {
       loading.value = false
       await router.replace('/list/services')
       toast.success(response.data.message)

     })

   }else{
     await addService({
       name: form.value.name,
       description: form.value.description,
     }).then(async response => {
       loading.value = false
       await router.replace('/list/services')
       toast.success(response.data.message)

     })
   }
  }
  catch (error) {
    snackbar.value = {
      show: true,
      message: 'An error occurred. Please try again.',
      color: 'error',
    }
    console.log(error)
  }
}

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => value ? true : 'Field is required.',
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Service Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Service Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Service Name"
                placeholder="First Name"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>

            <!-- 👉 Description -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.description"
                label="Description"
                placeholder="Middle Name"
                validate-on="submit"
                :rules="requiredRule"
              />
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
                href="/list/services"
              >
                Back
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCol>
    </VCard>
  </VCard>

  <!-- Snackbar for notifications -->
  <VSnackbar
    v-model:show="snackbar.show"
    :color="snackbar.color"
    timeout="3000"
    multi-line
    bottom
    right
  >
    {{ snackbar.message }}
  </VSnackbar>
</template>

<style scoped>
/* Additional styles if needed */
</style>
