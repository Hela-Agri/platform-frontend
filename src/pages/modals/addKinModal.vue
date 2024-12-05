<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { addKin } from '@/api/farmer'
import { formattedErrors } from '@/utils'
import {
  getAdministrationLevelOne,
  getAdministrationLevelThree,
  getAdministrationLevelTwo,
  getCountries, getRelationships,
} from '@/api/shared'

const props = defineProps<{
  dialog: boolean
  farmer: object
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh-farmer'): void
}>()

// Function to close the dialog
const closeDialog = () => {
  emit('update:dialog', false)
}

onMounted(async () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await getCountriesList()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await getRelationshipList()
})

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
  countries: any[]
  relationships: any[]
}

const countries = ref([])
const relationships = ref([])
const isLoading = ref(false)
const kinFormList = ref<KinForm[]>([])

const generateKinForm = async () => {
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
    countries: countries.value,
    relationships: relationships.value,
  }

  kinFormList.value.push(kinForm)
}

function addKinRow() {
  generateKinForm()
}

const requiredValidator = ref([
  (value: any) => {
    if (value)
      return true

    return 'Field is required.'
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
  if (event.valid)
    phoneBindingProps.styleClasses = ''
  else
    phoneBindingProps.styleClasses = 'v-input--error'
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

const getRelationshipList = async () => {
  try {
    getRelationships({}).then(response => {
      if (response.data.success)
        relationships.value = response.data?.data?.data
      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
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

const getKinAdministrationLevelOneList = async (form: any) => {
  try {
    getAdministrationLevelOne(form.country_id).then(response => {
      if (response.data.success)
        form.administrationOneList = response.data?.data?.data
      else
        console.log(response)
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
      else
        console.log(response)
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
      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const submitData = () => {
  try {
    const payload = {
      kins: kinsPayload(),
      user_id: props.farmer.id,
    }

    addKin(payload).then(async response => {
      if (response.status === 200) {
        toast.success(response.data.message)
        closeDialog()
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('refresh-farmer')
      }
      else {
        toast.error(formattedErrors(response.data.errors))
        closeDialog()
      }
    })
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="pa-4 text-center">
    <VDialog
      v-model="props.dialog"
      max-width="1600"
    >
      <VCard
        prepend-icon="bx bx-plus"
        title="Add Kin(s)"
      >
        <VCardText>
          <VForm @submit.prevent="submitData">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Kins
                </h6>
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <VTable>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Phone Number
                      </th>
                      <th class="text-left">
                        Postal Address
                      </th>
                      <th class="text-left">
                        Country
                      </th>
                      <th class="text-left">
                        County
                      </th>
                      <th class="text-left">
                        Sub County
                      </th>
                      <th class="text-left">
                        Ward
                      </th>
                      <th class="text-left">
                        Relationship
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(kinForm, index) in kinFormList"
                      :key="index"
                    >
                      <td>
                        <VTextField
                          v-model="kinForm.name"
                          min-width="120px"
                          placeholder="Name"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                      </td>
                      <td>
                        <vue-tel-input
                          v-bind="phoneBindingProps"
                          v-model="kinForm.phoneNumber"
                          @validate="checkMobileNumber($event)"
                        ></vue-tel-input>
                      </td>
                      <td>
                        <VTextField
                          v-model="kinForm.postalAddress"
                          min-width="120px"
                          placeholder="Postal Address"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="kinForm.country_id"
                          min-width="120px"
                          placeholder="kenya"
                          :items="kinForm.countries"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                          @update:model-value="getKinAdministrationLevelOneList(kinForm)"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="kinForm.administration_level_one_id"
                          min-width="120px"
                          placeholder="Kiambu"
                          :items="kinForm.administrationOneList"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                          @update:model-value="getKinAdministrationLevelTwoList(kinForm)"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="kinForm.administration_level_two_id"
                          min-width="120px"
                          placeholder="Kikuyu"
                          :items="kinForm.administrationTwoList"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                          @update:model-value="getKinAdministrationLevelThreeList(kinForm)"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="kinForm.administration_level_three_id"
                          min-width="120px"
                          placeholder="Kinoo"
                          :items="kinForm.administrationThreeList"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="kinForm.relationship_id"
                          min-width="120px"
                          placeholder="Mother"
                          :items="kinForm.relationships"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colspan="8"
                        class="text-right"
                      >
                        <VBtn
                          type="button"
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
                      </td>
                    </tr>
                  </tfoot>
                </VTable>
              </VCol>
            </VRow>
            <VDivider />
            <VCardActions>
              <VSpacer />
              <VSpacer />
              <VBtn
                text="Close"
                color="red"
                @click="closeDialog"
              />
              <VBtn type="submit">
                Submit
                <VIcon
                  icon="bx-save"
                  end
                  class="flip-in-rtl"
                />
              </VBtn>
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
