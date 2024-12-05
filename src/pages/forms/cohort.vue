<script lang="ts" setup>
import { getCategories } from "@/api/category"
import { getCenters } from "@/api/center"
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { addCohort,updateCohort,getCohort } from '@/api/cohort'
import { router } from '@/plugins/router'

const form = ref({
  name: '',
  description: '',
  duration: '',
  center_id: ''
})
const refCohortForm = ref()
const centers = ref()
const loading = ref(false)
const route = useRoute()
const submitForm = async () => {
  refCohortForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      try {
        loading.value = true
        if (form.value.id) {
          updateCohort(form.value.id, {
            name: form.value.name,
            description: form.value.description,
            duration: form.value.duration,
            center_id: form.value.center_id,
          }).then(async response => {
            loading.value = false
            toast.success(response.data.message)
            await router.replace('/list/cohorts')
          })
        } else {
          addCohort({
            name: form.value.name,
            description: form.value.description,
            duration: form.value.duration,
            center_id: form.value.center_id,
          }).then(async response => {
            loading.value = false
            toast.success(response.data.message)
            await router.replace('/list/cohorts')
          })
        }
      } catch (error) {
        loading.value = false
        console.log(error)
      }
    } else {
      loading.value = false
      toast.error('Kindly fill in all required fields')
    }
  })
}
const fetchCenters = async () => {
  loading.value = true
  try {
    getCenters({}).then(response => {
      if (response?.data?.success) {
        centers.value = response.data?.data?.data;
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
const fetchCohort = async () => {
  loading.value = true
  try {
    getCohort(form.value.id).then(response => {
      if (response?.data?.success) {
        form.value.name=response?.data?.data?.name;
        form.value.description=response?.data?.data?.description;
        form.value.duration=response?.data?.data?.duration;
        form.value.center_id=response?.data?.data?.center_id;

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
  fetchCenters();
  if(form.value.id){//its an edit so get the current product to be editted
    await fetchCohort()
  }

})
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
      <VCardTitle>Cohort Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm ref="refCohortForm" @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Cohort Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Cohort Name"
                placeholder="Cohort Name"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.description"
                label="Description"
                placeholder="Cohort Description"
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
                v-model="form.center_id"
                label="Select Center"
                placeholder="Select Center"
                :items="centers"
                item-title="name"
                item-value="id"
                validate-on="submit"
                :rules="requiredRule"
                @update:model-value="fetchCenters"
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
                href="/list/cohorts"
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
