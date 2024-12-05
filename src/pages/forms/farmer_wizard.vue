/* stylelint-disable @stylistic/declaration-block-trailing-semicolon */
<script lang="ts" setup>
import { toast } from 'vue3-toastify'
import { VCardSubtitle, VCardTitle, VIcon, VRow, VTextField } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'
import { ref } from 'vue'
import { createFarmer } from '@/api/farmer'
import {
  getAdministrationLevelOne,
  getAdministrationLevelThree,
  getAdministrationLevelTwo,
  getCountries,
  getRelationships,
  getUnits,
} from '@/api/shared'
import { router } from '@/plugins/router'
import { formattedErrors } from '@/utils'
import ImagePicker from '@/components/ImagePicker.vue'

// Define the type for the kinForm object
interface KinForm {
  id: string
  name: string
  phoneNumber: string
  postalAddress: string
  country_id: ReturnType<typeof ref>
  administration_level_one_id: ReturnType<typeof ref>
  administration_level_two_id: ReturnType<typeof ref>
  administration_level_three_id: ReturnType<typeof ref>
  relationship_id: ReturnType<typeof ref>
  administrationOneList: any[]
  administrationTwoList: any[]
  administrationThreeList: any[]
  nextOfKinCountries: any[]
  relationships: any[]
}

interface FarmForm {
  id: string
  ownership: string
  unit_id: ReturnType<typeof ref>
  size: string
  terrain: string
  latitude: ''
  longitude: ''
  location: ''
  units: any[]
}
const loading = ref(false)

const numberedSteps = [
  {
    title: 'Farmer Details',
    subtitle: 'Grower/ Farmer information',
    index: 0,
    icon: 'bx bx-user',
  },
  {
    title: 'Documents',
    subtitle: 'Upload ID and Passport',
    index: 1,
    icon: 'bx bxs-user-account',
  },
  {
    title: 'Next of Kin',
    subtitle: 'Add alternative contact details',
    index: 2,
    icon: 'bx bxs-group',
  },
  {
    title: 'Farm/Land Details',
    subtitle: 'Add farm details',
    index: 3,
    icon: 'bx bx-leaf',
  },
]

const countries = ref([])
const nextOfKinCountries = ref([])
const relationships = ref()
const units = ref()
const showMapPicker = ref(false)
const currentFarmForm = ref(0)
const administrationOneList = ref()
const administrationTwoList = ref()
const administrationThreeList = ref()
const currentStep = ref(0)
const isCurrentStepValid = ref(true)
const refFarmerForm = ref()
const refKinForm = ref()
const refDocumentForm = ref()
const refFarmForm = ref()
const route = useRoute()
const showAreaCalculator = ref(false)
const farmFormList = ref<FarmForm[]>([])
const formData = new FormData()
const kinFormList = ref<KinForm[]>([])

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

const generateKinForm = async () => {
  console.log(nextOfKinCountries.value)

  const kinForm: KinForm = {
    id: '',
    name: '',
    phoneNumber: '',
    postalAddress: '',
    country_id: ref(),
    administration_level_one_id: ref(),
    administration_level_two_id: ref(),
    administration_level_three_id: ref(),
    relationship_id: ref(),
    administrationOneList: [],
    administrationTwoList: [],
    administrationThreeList: [],
    nextOfKinCountries: nextOfKinCountries.value,
    relationships: relationships.value,
  }

  kinFormList.value.push(kinForm)
}

const farmerForm = ref({
  id: {},
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
  userName: ref(''),
})

const generateFarmForm = async () => {
  const farmForm: FarmForm = {
    id: '',
    ownership: '',
    size: '',
    unit_id: ref(),
    terrain: '',
    latitude: '',
    longitude: '',
    location: '',
    units: units.value,
  }

  farmFormList.value.push(farmForm)
}

function addKinRow() {
  generateKinForm()
}
function removeKinRow(index: number) {
  kinFormList.value.splice(index, 1)
}
function removeFarmRow(index: number) {
  farmFormList.value.splice(index, 1)
}

function addFarmRow() {
  generateFarmForm()
}
function toggleShowMapPicker(idx: any) {
  currentFarmForm.value = idx
  showAreaCalculator.value = false
  showMapPicker.value = !showMapPicker.value
}
function toggleShowAreaCalculator(idx: any) {
  currentFarmForm.value = idx
  showMapPicker.value = false
  showAreaCalculator.value = !showAreaCalculator.value
}

function setLocation(payloadList: Array<any>) {
  const payload = payloadList[0]

  farmFormList.value[currentFarmForm.value].location = payload.formatted_address
  farmFormList.value[currentFarmForm.value].latitude = payload.geometry.location.lat
  farmFormList.value[currentFarmForm.value].longitude = payload.geometry.location.lng
  payload.geometry.location.longitude

  showMapPicker.value = !showMapPicker.value
}
function setArea(payload: any) {
  showAreaCalculator.value = !showAreaCalculator.value
  farmFormList.value[currentFarmForm.value].size = payload.area

  const unit = units.value.filter(unit => unit.name.includes(payload.unit_of_measure))

  farmFormList.value[currentFarmForm.value].unit_id = unit?.[0]?.id
}
onMounted(async () => {
  farmerForm.value.id = route.params.uuid
  await getCountriesList()
  await getRelationshipList()
  await getUnitList()
})

const checkMobileNumber = (event: any) => {
  if (event.valid)
    phoneBindingProps.styleClasses = ''

  else
    phoneBindingProps.styleClasses = 'v-input--error'
}

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

const validateFarmerForm = () => {
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

const validateDocumentForm = () => {
  refDocumentForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else {
      isCurrentStepValid.value = false
    }
  })
}

const validateKinForm = () => {
  refKinForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else {
      isCurrentStepValid.value = false
    }
  })
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

const kinsPayload = () => {
  const kins: {
    id: string
    name: string
    phone_number: string
    postal_address: string
    country_id: unknown
    administration_level_one_id: unknown
    administration_level_two_id: unknown
    administration_level_three_id: unknown
    relationship_id: unknown
  }[] = []

  kinFormList.value.forEach(element => {
    kins.push({
      id: element.id,
      name: element.name,
      phone_number: element.phoneNumber,
      postal_address: element.postalAddress,
      country_id: element.country_id,
      administration_level_one_id: element.administration_level_one_id,
      administration_level_two_id: element.administration_level_two_id,
      administration_level_three_id: element.administration_level_three_id,
      relationship_id: element.relationship_id,
    })
  })

  return kins
}

const farmsPayload = () => {
  const farms: {
    id: string
    ownership: string
    location: string
    latitude: string
    longitude: string
    size: string
    unit_id: unknown
    terrain: string
  }[] = []

  farmFormList.value.forEach(element => {
    farms.push({
      id: element.id,
      ownership: element.ownership,
      size: element.size,
      unit_id: element.unit_id,
      location: element.location,
      latitude: element.latitude,
      longitude: element.longitude,
      terrain: element.terrain,
    })
  })

  return farms
}

const submitData = async () => {
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
    formData.append('username', farmerForm.value.userName)
    formData.append('kins', JSON.stringify(kinsPayload()))
    formData.append('farms', JSON.stringify(farmsPayload()))

    createFarmer(formData).then(async response => {
      console.log(response.status)
      if (response.status === 200) {
        await router.replace('/list/farmers').then(() => {
          toast.success(response.data.message)
        })
      }
      else {
        toast.error(formattedErrors(response.data))
      }
    })
  }
  catch (error) {
    toast.error(error)

    // Handle error
    console.error('Error:', error)
  }
}

const genUsrName = async () => {
  farmerForm.value.userName = `${farmerForm.value.firstName.toLowerCase()}.${farmerForm.value.lastName.toLowerCase()}`
}

const getCountriesList = async () => {
  try {
    getCountries({}).then(response => {
      if (response.data.success) {
        countries.value = response.data?.data?.data
        nextOfKinCountries.value = response.data?.data?.data
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

const getUnitList = async () => {
  try {
    getUnits({ classification: 'farm' }).then(response => {
      if (response.data.success) {
        units.value = response.data?.data?.data

        generateKinForm()
        generateFarmForm()
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

const getRelationshipList = async () => {
  try {
    getRelationships({}).then(response => {
      if (response.data.success)
        relationships.value = response.data?.data?.data
      else console.log(response)
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
      else console.log(response)
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
        else console.log(response)
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
        else console.log(response)
      },
    )
  }
  catch (error) {
    console.log(error)
  }
}

const getKinAdministrationLevelOneList = async (form: any) => {
  try {
    getAdministrationLevelOne(form.country_id).then(response => {
      if (response.data.success)
        form.administrationOneList = response.data?.data?.data
      else console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const getKinAdministrationLevelTwoList = async (form: any) => {
  try {
    getAdministrationLevelTwo(form.administration_level_one_id).then(response => {
      if (response.data.success)
        form.administrationTwoList = response.data?.data?.data
      else console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const getKinAdministrationLevelThreeList = async (form: any) => {
  try {
    getAdministrationLevelThree(form.administration_level_two_id).then(response => {
      if (response.data.success)
        form.administrationThreeList = response.data?.data?.data
      else console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const requiredFile = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value.length == 0)
      return 'Image is required.'
    else
      return true
  },
])

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
  <VCard v-if="!showMapPicker && !showAreaCalculator">
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
            @submit.prevent="validateFarmerForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Farmer Details
                </h6>
                <p class="mb-0">
                  Grower/ Farmer information (Bio Data)
                </p>
              </VCol>

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
                  @input="genUsrName"
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
                  :rules="requiredValidator"
                  @input="genUsrName"
                />
              </VCol>

              <!-- 👉 Phone No -->
              <VCol
                cols="12"
                md="6"
              >
                <vue-tel-input
                  v-bind="phoneBindingProps"
                  v-model="farmerForm.phoneNumber"
                  width="200px"
                  @validate="checkMobileNumber($event)"
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
                  v-model="farmerForm.country_id"
                  label="Country"
                  placeholder="kenya"
                  :items="countries"
                  item-title="name"
                  item-value="id"
                  clearable
                  validate-on="submit"
                  :rules="requiredValidator"
                  @update:model-value="getAdministrationLevelOneList"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="farmerForm.administration_level_one_id"
                  label="County"
                  placeholder="kenya"
                  :items="administrationOneList"
                  item-title="name"
                  clearable
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                  @update:model-value="getAdministrationLevelTwoList"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="farmerForm.administration_level_two_id"
                  label="Sub County"
                  placeholder="Dagoretti North"
                  clearable
                  :items="administrationTwoList"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                  @update:model-value="getAdministrationLevelThreeList"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="farmerForm.administration_level_three_id"
                  label="Ward"
                  clearable
                  placeholder="Westlands"
                  :items="administrationThreeList"
                  item-title="name"
                  item-value="id"
                  validate-on="submit"
                  :rules="requiredValidator"
                />
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn
                    type="submit"
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
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refDocumentForm"
            @submit.prevent="validateDocumentForm"
          >
            <VRow class="justify-center mt-5">
              <VCol
                cols="6"
                md="6"
              >
                <!--                  :required-validator="requiredFile" -->
                <ImagePicker
                  custom_class="mt-10"
                  image_label="Upload Passport Photo"

                  placeholder="Select First Image"
                  @select:image="processPassportFile"
                />
                <!--                  :required-validator="requiredFile" -->
                <ImagePicker
                  custom_class="mt-10"
                  image_label="Upload ID (Front)"

                  placeholder="Select First Image"
                  @select:image="processIdFrontFile"
                />
                <!--                  :required-validator="requiredFile" -->
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
                    Next
                    <VIcon
                      icon="bx-right-arrow-alt"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
        <VWindowItem>
          <VForm
            ref="refKinForm"
            @submit.prevent="validateKinForm"
          >
            <VCol>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Next of Kin
                </h6>
                <p class="mb-0">
                  Please Provide Names of two two individuals we can reach
                </p>
              </VCol>

              <VRow
                v-for="(kinForm, index) in kinFormList"
                :key="index"
                cols="12"
                class="justify-end"
              >
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="kinForm.name"
                    class="pa-3"
                    label="Kin Full Names"
                    min-width="120px"
                    placeholder="Name"
                    validate-on="submit"
                    :rules="requiredValidator"
                  />

                  <vue-tel-input
                    v-bind="phoneBindingProps"
                    v-model="kinForm.phoneNumber"
                    class="ma-3"
                    @validate="checkMobileNumber($event)"
                  />
                  <VTextField
                    v-model="kinForm.postalAddress"
                    class="pa-3"
                    min-width="120px"
                    placeholder="Postal Address"
                    validate-on="submit"
                    :rules="requiredValidator"
                  />
                  <VSelect
                    v-model="kinForm.relationship_id"
                    class="pa-3"
                    min-width="120px"
                    placeholder="Relationship to Farmer"
                    :items="relationships"
                    item-title="name"
                    item-value="id"
                    clearable
                    validate-on="submit"
                    :rules="requiredValidator"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VRow>
                    <VCol>
                      <VSelect
                        v-model="kinForm.country_id"
                        class="pa-3"
                        min-width="120px"
                        placeholder="kenya"
                        clearable
                        label="Country"
                        :items="nextOfKinCountries"
                        item-title="name"
                        item-value="id"
                        validate-on="submit"
                        :rules="requiredValidator"
                        @update:model-value="getKinAdministrationLevelOneList(kinForm)"
                      />

                      <VSelect
                        v-model="kinForm.administration_level_one_id"
                        class="pa-3"
                        min-width="120px"
                        label="County"
                        placeholder="Kiambu"
                        clearable
                        :items="kinForm.administrationOneList"
                        item-title="name"
                        item-value="id"
                        validate-on="submit"
                        :rules="requiredValidator"
                        @update:model-value="getKinAdministrationLevelTwoList(kinForm)"
                      />

                      <VSelect
                        v-model="kinForm.administration_level_two_id"
                        class="pa-3"
                        min-width="120px"
                        clearable
                        label="Sub County"
                        placeholder="Kikuyu"
                        :items="kinForm.administrationTwoList"
                        item-title="name"
                        item-value="id"
                        validate-on="submit"
                        :rules="requiredValidator"
                        @update:model-value="
                          getKinAdministrationLevelThreeList(kinForm)
                        "
                      />

                      <VSelect
                        v-model="kinForm.administration_level_three_id"
                        class="pa-3"
                        min-width="120px"
                        placeholder="Kinoo"
                        label="Ward"
                        :items="kinForm.administrationThreeList"
                        item-title="name"
                        item-value="id"
                        validate-on="submit"
                        :rules="requiredValidator"
                        clearable
                      />
                    </VCol>

                    <VBtn
                      v-if="index > 0"
                      color="error"
                      density="compact"
                      icon="bx-trash"
                      @click="removeKinRow(index)"
                    />
                  </VRow>
                </VCol>

                <VDivider class="pa-2" />
              </VRow>

              <VCol cols="12">
                <VBtn

                  class="float-end"
                  size="x-small"
                  type="button"
                  rounded
                  variant="outlined"
                  @click="addKinRow"
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
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
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
                    Next
                    <VIcon
                      icon="bx-right-arrow-alt"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
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
                  Farm Details
                </h6>
                <p class="mb-0">
                  Add farm details
                </p>
              </VCol>

              <VRow
                v-for="(farmForm, index) in farmFormList"
                :key="index"
              >
                <!-- First column -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="farmForm.ownership"
                    class="mt-2"
                    clearable
                    label="Select"
                    :items="[
                      { name: 'Owned', value: 'owned' },
                      { name: 'Leased', value: 'leased' },
                      { name: 'Family Land', value: 'family_land' },
                    ]"
                    item-title="name"
                    item-value="value"
                  />
                </VCol>

                <!-- Second column -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="farmForm.terrain"
                    class="mt-2"
                    clearable
                    label="Select"
                    :items="[
                      { name: 'Flat', value: 'flat' },
                      { name: 'Slope', value: 'slope' },
                    ]"
                    item-title="name"
                    item-value="value"
                  />
                </VCol>
                <!-- First column -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <div class="content">
                    <VRow min-width="250px">
                      <VTextField
                        v-model="farmForm.location"
                        class="ma-3"
                        min-width="200px"
                        label="Farm Location"
                        type="text"
                        readonly
                      >
                        <template #append>
                          <VIcon
                            icon="bx bx-map-pin"
                            size="24"
                            class="mx-2 my-2"
                            color="primary"
                            @click="toggleShowMapPicker(index)"
                          />
                        </template>
                      </VTextField>
                    </VRow>
                  </div>
                </VCol>

                <!-- Second column -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <VRow>
                    <VTextField
                      v-model="farmForm.size"
                      class="ma-3"
                      label="Size"
                      type="number"
                      clearable
                    >
                      <template #append>
                        <VSelect
                          v-model="farmForm.unit_id"
                          min-width="100px"
                          placeholder="Acre"
                          :items="farmForm.units"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                        <VIcon
                          icon="bx bx-map-alt"
                          size="24"
                          class="mx-2 my-2"
                          color="primary"
                          @click="toggleShowAreaCalculator(index)"
                        />
                      </template>
                    </VTextField>
                  </VRow>
                  <VBtn
                    v-if="index > 0"
                    class="float-end pa-2"
                    color="error"
                    density="compact"
                    icon="bx-trash"
                    @click="removeFarmRow(index)"
                  />
                </VCol>

                <VDivider class="pa-2" />
              </VRow>

              <VCol cols="12">
                <VBtn
                  class="float-end"
                  size="x-small"
                  type="button"
                  rounded
                  variant="outlined"
                  @click="addFarmRow"
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
  <LocationPicker
    v-if="showMapPicker"
    @set-location="setLocation"
  />
  <AreaCalculator
    v-if="showAreaCalculator"
    @set-area="setArea"
  />
</template>

<style scoped>
.v-table{
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
