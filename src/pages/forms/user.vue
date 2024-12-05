<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import Password from '@/pages/forms/password.vue'
import { getRoles } from '@/api/role'
import { createUser, getUser, updateUser } from '@/api/user'
import { router } from '@/plugins/router'
import { formattedErrors } from '@/utils'

const roles = ref([])
const refUserForm = ref()
const route = useRoute()
const loading = ref<boolean>(false)

const phoneBindingProps = {
  mode: 'international',
  styleClasses: 'has-default',
  defaultCountry: 'KE',
  onlyCountries: ['KE', 'RW', 'UG', 'TZ', 'ET', 'BW'],
  inputOptions: {
    showDialCode: false,
    placeholder: 'Mobile Number',
    name: 'phone',
  },
}

const form = ref({
  id: {},
  firstName: '',
  middleName: '',
  lastName: '',
  registrationNumber: '',
  email: '',
  role_id: '',
  phoneNumber: '',
  userName: ref(''),
})

const checkMobileNumber = (event: any) => {
  if (event.valid)
    phoneBindingProps.styleClasses = ''

  else
    phoneBindingProps.styleClasses = 'v-input--error'
}

const requiredRule = ref([
  (value: any) => {
    if (value)
      return true

    return 'Field is required.'
  },
])

const getRolesList = async () => {
  try {
    getRoles({}).then(response => {
      if (response.data.success)
        roles.value = response.data?.data?.data
      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const getUserData = async () => {
  try {
    getUser(form.value.id).then(response => {
      if (response.data.success) {
        form.value.firstName = response.data?.data?.first_name
        form.value.middleName = response.data?.data?.middle_name
        form.value.lastName = response.data?.data?.last_name
        form.value.registrationNumber = response.data?.data?.registration_number
        form.value.email = response.data?.data?.email
        form.value.role_id = response.data?.data?.role_id
        form.value.phoneNumber = response.data?.data?.phone_number
        form.value.userName = response.data?.data?.username
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

const submitForm = async () => {
  try {
    refUserForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        loading.value = true;
        if (form.value.id) {
          updateUser(form.value.id, payload).then(async res => {
            if (res.status === 200) {
              loading.value = false
              await router.replace('/list/users').then(() => {
                toast.success(res.data.message)
              })
            }
            else {
              loading.value = false
              toast.error(formattedErrors(res.data.errors))
            }
          })
        }
        else {
          createUser(payload).then(async res => {
            if (res.status == 200) {
              loading.value = false
              await router.replace('/list/users').then(() => {
                toast.success(res.data.message)
              })
            }
            else {
              loading.value = false
              toast.error(formattedErrors(res.data.errors))
            }
          })
        }
      }
      else {
        loading.value = false
        toast.error('Kindly fill in all required fields')
      }
    })

    const payload = {
      first_name: form.value.firstName,
      middle_name: form.value.middleName,
      last_name: form.value.lastName,
      registration_number: form.value.registrationNumber,
      email: form.value.email,
      role_id: form.value.role_id,
      phone_number: form.value.phoneNumber,
      username: form.value.userName,

    }
  }
  catch (error: any) {
    toast.error(error.errors)

    console.log(error)
  }
}

const genUsrName = async () => {
  form.value.userName = `${form.value.firstName.toLowerCase()}.${form.value.lastName.toLowerCase()}`
}

onMounted(() => {
  form.value.id = route.params.uuid
  getRolesList()

  if (form.value.id)
    getUserData()
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardItem>
          <VCardTitle>Personal Info</VCardTitle>
        </VCardItem>
        <VCol
          cols="12"
          md="12"
        >
          <VForm
            ref="refUserForm"
            @submit.prevent="() => submitForm()"
          >
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.firstName"
                  label="First Name"
                  placeholder="First Name"
                  validate-on="submit"
                  :rules="requiredRule"
                  @input="genUsrName"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.middleName"
                  label="Middle Name"
                  placeholder="Middle Name"
                  validate-on="submit"
                  :rules="requiredRule"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  validate-on="submit"
                  :rules="requiredRule"
                  @input="genUsrName"
                />
              </VCol>
              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.userName"
                  label="username"
                  type="text"
                  placeholder="johndoe@email.com"
                  validate-on="submit"
                  :rules="requiredRule"
                />
              </VCol>
              <!-- 👉 Country -->
              <VCol
                cols="12"
                md="6"
              >
                <vue-tel-input
                  v-bind="phoneBindingProps"
                  v-model="form.phoneNumber"
                  @validate="checkMobileNumber($event)"
                />
              </VCol>
              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.email"
                  label="Email"
                  placeholder="email@email.com"
                  type="email"
                  validate-on="submit"
                  :rules="requiredRule"
                />
              </VCol>

              <!-- 👉 City -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.registrationNumber"
                  label="Id/Passport No"
                  placeholder="123456"
                  type="text"
                  validate-on="submit"
                  :rules="requiredRule"
                />
              </VCol>
              <!-- 👉 City -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="form.role_id"
                  label="Role"
                  placeholder="123456"
                  :items="roles"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredRule"
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex gap-4"
              >
                <VBtn type="submit" :loading="loading">
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  color="secondary"
                  href="/list/users"
                  variant="tonal"
                >
                  Back
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCol>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <VCard v-if="form.id">
        <VCardItem>
          <Password />
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>
</template>
