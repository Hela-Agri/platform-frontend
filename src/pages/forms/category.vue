<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { addCategory } from '@/api/category'
import { router } from '@/plugins/router'

const form = ref({
  name: '',
  description: '',
})

const loading = ref(false)

const submitForm = async () => {
  loading.value = true
  try {
    addCategory({
      name: form.value.name,
      description: form.value.description,
    }).then(async response => {
      loading.value = false
      toast.success(response.data.message)
      await router.replace('/list/categories')
    })
  }
  catch (error) {
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
      <VCardTitle>Category Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Category Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Category Name"
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
                href="/list/categories"
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
