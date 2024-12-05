<script lang="ts" setup>
import { ref } from 'vue'
import type { Content } from 'vue3-toastify'
import { toast } from 'vue3-toastify'
import { changePassword } from '@/api/user'
import { router } from '@/plugins/router'

const changePasswordForm = ref({
  old_password: '',
  password: '',
  confirm_password: '',
})

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value)
      return true

    return 'Field is required.'
  },
])

const isOldPasswordVisible = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const loading = ref(false)
const refPasswordForm = ref()

const submitForm = async () => {
  loading.value = true
  try {
    refPasswordForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        changePassword({
          current_password: changePasswordForm.value.old_password,
          password: changePasswordForm.value.password,
          password_confirmation: changePasswordForm.value.confirm_password,
        }).then(async (response: { data: { message: Content } }) => {
          loading.value = false
          toast.success(response.data.message)
          await router.replace('/login')
        })
      }
      else {
        loading.value = false
      }
    })
  }
  catch (error) {
    loading.value = false
    console.log(error)
  }
}
</script>

<template>
  <VForm
    ref="refPasswordForm"
    @submit.prevent="() => submitForm()"
  >
    <VCard>
      <VCardItem class="pb-3">
        <VCardTitle class="mb-1">
          Change password
        </VCardTitle>
      </VCardItem>
      <VCardItem class="pb-3">
        <VAlert
          title="Secure Password"
          type="warning"
          closable
          variant="tonal"
          text="Minimum 8 characters long, uppercase & symbol
"
        />
      </VCardItem>
      <VCardItem class="pb-3">
        <VRow>
          <VCol
            class="mt-3"
            cols="4"
            md="4"
          >
            <VTextField
              v-model="changePasswordForm.old_password"
              validate-on="submit"
              :rules="requiredRule"
              label="Old Password"
              placeholder="············"
              :type="isOldPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isOldPasswordVisible ? 'bx-hide' : 'bx-show'"
              @click:append-inner="isOldPasswordVisible = !isOldPasswordVisible"
            />
          </VCol>
          <VCol
            class="mt-3"
            cols="4"
            md="4"
          >
            <VTextField
              v-model="changePasswordForm.password"
              validate-on="submit"
              :rules="requiredRule"
              label="New Password"
              placeholder="············"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />
          </VCol>
          <VCol
            class="mt-3"
            cols="4"
            md="4"
          >
            <VTextField
              v-model="changePasswordForm.confirm_password"
              validate-on="submit"
              :rules="requiredRule"
              label="Confirm Password"
              placeholder="············"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
              @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            />
          </VCol>
        </VRow>
      </VCardItem>
      <VCardItem class="pb-3">
        <VBtn
          :loading="loading"
          type="submit"
        >
          Change Password
        </VBtn>
      </VCardItem>
    </VCard>
  </VForm>
</template>
