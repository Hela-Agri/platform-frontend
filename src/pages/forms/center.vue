<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import {addCenter, getCenter, updateCenter} from '@/api/center'
import { router } from '@/plugins/router'
import {getCategories} from "@/api/category";
import {getUnits} from "@/api/shared";


const form = ref({
  id: '',
  name: '',
  description: '',
})
const route = useRoute()
const centres = ref()
const loading = ref<boolean>(false)

const refCenterForm = ref()

const fetchCenter = async () => {
  loading.value = true
  try {
    getCenter(form.value.id).then(response => {
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

  if(form.value.id){//its an edit so get the current center to be editted
    await fetchCenter();
  }

})


const submitForm = async () => {
  refCenterForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      try {
        if(form.value.id){
          updateCenter(form.value.id,{
            name: form.value.name,
            description: form.value.description,

          }).then(async response => {
            loading.value = false
            await router.replace('/list/centers')
            toast.success(response.data.message)

          })
        }else{
          addCenter({
            name: form.value.name,
            description: form.value.description,

          }).then(async response => {
            loading.value = false
            toast.success(response.data.message)
            await router.replace('/list/centers')
          })
        }

      }
      catch (error) {
        loading.value = false
        console.log(error)
      }
    } else {
      loading.value = false
      toast.error('Kindly fill in all required fields')
    }
  })
  loading.value = true

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
      <VCardTitle>Center Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm   ref="refCenterForm"  @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Center Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Center Name"
                placeholder="Center Name"
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
                placeholder="Description"
                validate-on="submit"
                :rules="requiredRule"
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
                href="/list/centers"
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
