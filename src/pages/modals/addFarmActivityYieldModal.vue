<script lang="ts" setup>
import { updateFarmerActivity } from "@/api/farmer"
import { defineEmits, defineProps, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import moment from 'moment'
import { VTextField } from 'vuetify/components'
import { formattedErrors } from '@/utils'
import { getUnits } from '@/api/shared'

const props = defineProps<{
  dialog: boolean
  activity: object
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh-farm-activity'): void
}>()

// Function to close the dialog
const closeDialog = () => {
  emit('update:dialog', false)
}

onMounted(async () => {
  await getUnitList()
})

const units = ref([])
const isLoading = ref(false)
const YieldFormList = ref<YieldForm[]>([])

interface YieldForm {
  id: string
  weight: ReturnType<typeof ref>
  unit_id: string
  date: string
  units: any[]
}

const generateYieldForm = async () => {
  const YieldForm: YieldForm = {
    id: '',
    weight: ref(),
    unit_id: '',
    units: units.value,
    date: moment().format('YYYY-MM-DD'),
  }

  YieldFormList.value.push(YieldForm)
}

const getUnitList = async () => {
  try {
    getUnits({ classification: 'product' }).then(response => {
      if (response.data.success) {
        units.value = response.data?.data?.data
        generateYieldForm()
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

function addYieldRow() {
  generateYieldForm()
}

const FarmYieldsPayload = () => {
  const items: { weight: string; unit_id: string; harvest_date: unknown }[] = []

  YieldFormList.value.forEach(element => {
    items.push({
      weight: element.weight,
      unit_id: element.unit_id,
      harvest_date: moment(String(element.date!)).format('YYYY-MM-DD hh:mm:ss'),
    })
  })

  return items
}

const submitData = () => {
  try {
    const payload = {
      farm_activity_yields: FarmYieldsPayload(),
    }

    updateFarmerActivity(props.activity.id, payload).then(async response => {
      if (response.status === 200) {
        toast.success(response.data.message)
        closeDialog()
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('refresh-farm-activity')
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

const requiredValidator = ref([
  (value: any) => {
    if (value)
      return true

    return 'Field is required.'
  },
])
</script>

<template>
  <div class="pa-4 text-center">
    <VDialog
      v-model="props.dialog"
      max-width="600"
    >
      <VCard
        min-height="500"
        prepend-icon="bx bx-plus"
        title="Add Farm Yield(s)"
      >
        <VCardText>
          <VForm @submit.prevent="submitData">
            <VRow>
              <VCol cols="12">

              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <VTable>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Weight
                      </th>
                      <th class="text-left">
                        Unit Of Measure
                      </th>
                      <th class="text-left">
                        Harvest Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(YieldForm, index) in YieldFormList"
                      :key="index"
                    >
                      <td>
                        <VTextField
                          v-model="YieldForm.weight"
                          max-width="200px"
                          label="Weight"
                          type="number"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="YieldForm.unit_id"
                          min-width="120px"
                          placeholder="Acre"
                          :items="YieldForm.units"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                      </td>
                      <td>
                        <VTextField
                          v-model="YieldForm.date"
                          type="date"
                          width="160px"
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
                          @click="addYieldRow"
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
