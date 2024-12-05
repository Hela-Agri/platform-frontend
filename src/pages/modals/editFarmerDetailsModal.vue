<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import {
  getAdministrationLevelOne,
  getAdministrationLevelThree,
  getAdministrationLevelTwo, getCountries,
} from '@/api/shared'
import { formattedErrors } from '@/utils'
import { updateFarmer } from '@/api/farmer'
import ImagePicker from "@/components/ImagePicker.vue";
import {VIcon, VRow} from "vuetify/components";

const props = defineProps<{
  dialog: boolean
  farmer: object
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh-farmer'): void
}>()

const administrationOneList = ref()
const administrationTwoList = ref()
const administrationThreeList = ref()
const countries = ref()
const loading = ref(false)
const formData = new FormData()

watch(
  () => props.farmer,
  farmerDetails => {
    farmerForm.value.id = farmerDetails.id
    farmerForm.value.firstName = farmerDetails.first_name
    farmerForm.value.middleName = farmerDetails.middle_name
    farmerForm.value.lastName = farmerDetails.last_name
    farmerForm.value.registrationNumber = farmerDetails.registration_number
    farmerForm.value.phoneNumber = farmerDetails.phone_number
    farmerForm.value.email = farmerDetails.email
    farmerForm.value.role_id = farmerDetails.role_id
    farmerForm.value.country_id = farmerDetails.country_id
    farmerForm.value.administration_level_one_id = farmerDetails.administration_level_one_id
    farmerForm.value.administration_level_two_id = farmerDetails.administration_level_two_id
    farmerForm.value.administration_level_three_id = farmerDetails.administration_level_three_id
  },
)

watch(
  () => props.farmer,
  async newVal => {
    if (newVal)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await getCountriesList()
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await getAdministrationLevelOneList()
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await getAdministrationLevelTwoList()
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await getAdministrationLevelThreeList()
  },
)

const farmerForm = ref({
  id: '',
  firstName: '',
  middleName: '',
  lastName: '',
  registrationNumber: '',
  email: '',
  role_id: '',
  phoneNumber: '',
  country_id: '',
  administration_level_one_id: '',
  administration_level_two_id: '',
  administration_level_three_id: '',
})

const requiredValidator = ref([
  (value: any) => {
    if (value)
      return true

    return 'Field is required.'
  },
])

const emailValidator = ref([
  (value: any) => {
    if (value.length > 0) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

      return pattern.test(value) || 'Enter a valid email address.'
    }

    return true
  },
])

const phoneBindingProps = {
  mode: 'international',
  styleClasses: '',
  defaultCountry: 'KE',
  onlyCountries: ['KE', 'RW', 'UG', 'TZ', 'ET', 'BW'],
  required: true,
  inputOptions: {
    showDialCode: false,
    placeholder: 'Mobile Number',
    name: 'phone',
  },
}

const checkMobileNumber = (event: any) => {
  if (event.valid) {
    farmerForm.value.phoneNumber = event.number
    phoneBindingProps.styleClasses = ''
  }
  else {
    farmerForm.value.phoneNumber = ''
    phoneBindingProps.styleClasses = 'v-input--error'
  }
}

const closeDialog = () => {
  emit('update:dialog', false)
}

const getCountriesList = async () => {
  try {
    getCountries({}).then(response => {
      if (response.data.success)
        countries.value = response.data?.data?.data
      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const getAdministrationLevelOneList = async () => {
  try {
    getAdministrationLevelOne(farmerForm.value.country_id).then(response => {
      if (response.data.success)
        administrationOneList.value = response.data?.data?.data
      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const getAdministrationLevelTwoList = async () => {
  try {
    getAdministrationLevelTwo(farmerForm.value.administration_level_one_id).then(
      response => {
        if (response.data.success)
          administrationTwoList.value = response.data?.data?.data
        else
          console.log(response)
      },
    )
  }
  catch (error) {
    console.log(error)
  }
}

const getAdministrationLevelThreeList = async () => {
  try {
    getAdministrationLevelThree(farmerForm.value.administration_level_two_id).then(
      response => {
        if (response.data.success)
          administrationThreeList.value = response.data?.data?.data
        else
          console.log(response)
      },
    )
  }
  catch (error) {
    console.log(error)
  }
}

const submitForm = () => {
  loading.value = true
  try {
    formData.append('first_name', farmerForm.value.firstName)
    formData.append('middle_name', farmerForm.value.middleName)
    formData.append('last_name', farmerForm.value.lastName)
    formData.append('registration_number', farmerForm.value.registrationNumber)
    formData.append('email', farmerForm.value.email)
    formData.append('phone_number', farmerForm.value.phoneNumber)
    formData.append('country_id', farmerForm.value.country_id)
    formData.append('administration_level_one_id', farmerForm.value.administration_level_one_id)
    formData.append('administration_level_two_id', farmerForm.value.administration_level_two_id)
    formData.append('administration_level_three_id', farmerForm.value.administration_level_three_id)

    updateFarmer(farmerForm.value.id, formData).then(async response => {
      if (response.status === 200) {
        emit('refresh-farmer')
        closeDialog()
        toast.success(response.data.message)
      }
      else {
        toast.error(formattedErrors(response.data.errors))
      }
    })
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}


const processPassportFile = (file: File) => {
  try {
    formData.set('passport_file', file)
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

const processIdFrontFile = (file: File) => {
  try {
    formData.set('id_front_file', file)
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

const processIDBackFile = (file: File) => {
  try {
    formData.set('id_back_file', file)
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="pa-4 text-center">
    <VDialog
      v-model="props.dialog"
      max-width="900"
    >
      <VCard
        prepend-icon="bx-edit-alt"
        title="Edit Farmer Profile"
      >
        <VForm
          ref="refFarmerForm"
          @submit.prevent="submitForm"
        >
          <VCardText>
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="farmerForm.firstName"
                  label="First Name"
                  placeholder="First Name"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="farmerForm.middleName"
                  label="Middle Name"
                  placeholder="Middle Name"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="farmerForm.lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  validate-on="submit"
                />
              </VCol>

              <!-- 👉 Phone No -->
              <VCol
                cols="12"
                md="6"
              >
                <vue-tel-input
                  @validate="checkMobileNumber($event)"
                  v-bind="phoneBindingProps"
                  v-model="farmerForm.phoneNumber"
                ></vue-tel-input>
              </VCol>
              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="farmerForm.email"
                  label="Email"
                  placeholder="email@email.com"
                  type="email"
                  validate-on="submit"
                  :rules="emailValidator"
                />
              </VCol>

              <!-- 👉 City -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="farmerForm.registrationNumber"
                  label="Id/Passport No"
                  placeholder="123456"
                  type="text"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-if="countries"
                  v-model="farmerForm.country_id"
                  label="Country"
                  placeholder="kenya"
                  :items="countries"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                  @update:model-value="getAdministrationLevelOneList"
                />
                <VSkeletonLoader
                  v-else
                  type="list-item-two-line"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-if="administrationOneList"
                  v-model="farmerForm.administration_level_one_id"
                  label="County"
                  placeholder="kenya"
                  :items="administrationOneList"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                  @update:model-value="getAdministrationLevelTwoList"
                />
                <VSkeletonLoader
                  v-else
                  type="list-item-two-line"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-if="administrationTwoList"
                  v-model="farmerForm.administration_level_two_id"
                  label="Sub County"
                  placeholder="Dagoretti North"
                  :items="administrationTwoList"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                  @update:model-value="getAdministrationLevelThreeList"
                />
                <VSkeletonLoader
                  v-else
                  type="list-item-two-line"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-if="administrationThreeList"
                  v-model="farmerForm.administration_level_three_id"
                  label="Ward"
                  placeholder="Westlands"
                  :items="administrationThreeList"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
                <VSkeletonLoader
                  v-else
                  type="list-item-two-line"
                />
              </VCol>
              <v-divider></v-divider>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Edit Documents
                </h6>
                <p class="mb-0">
                  Select image to upload
                </p>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <ImagePicker
                  custom_class="mt-10"
                  image_label="Upload Passport Photo"

                  placeholder="Select First Image"
                  @select:image="processPassportFile"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <ImagePicker
                  custom_class="mt-10"
                  image_label="Upload ID (Front)"
                  placeholder="Select First Image"
                  @select:image="processIdFrontFile"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <ImagePicker
                  custom_class="mt-10"
                  image_label="Upload ID (Back)"
                  placeholder="Select First Image"
                  @select:image="processIDBackFile"
                />
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn
                    color="red"
                    variant="tonal"
                    @click="closeDialog"
                  >
                    Close
                  </VBtn>

                  <VBtn
                    color="primary"
                    type="Save"
                  >
                    Submit
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </VCard>
    </VDialog>
  </div>
</template>
