<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { downloadCohortLoan } from '@/api/cohort'
import { ElMessage } from "element-plus";

const props = defineProps<{
  dialog: boolean
  cohort: object
  multiple: boolean
  description: string
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh'): void
}>()

const isLoading = ref(false)
const dialogModel = ref(props.dialog)

// Watch for changes in the dialog prop
watch(() => props.dialog, (newValue) => {
  dialogModel.value = newValue
  if (newValue) {
    initializeDateRange()
  }
})

const dateRange = ref([])

const initializeDateRange = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  dateRange.value = [startOfMonth, endOfMonth]
}

const closeDialog = () => {
  emit('update:dialog', false)
}

const submitDownloadRequest = () => {

  const dates = dateRange.value.map(date => new Date(date));
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

  const date_range_array = [
    startDate,
    endDate
  ]

  try {
    isLoading.value = true
    if (props.multiple) {
      downloadCohortLoan(props.cohort.id, {date_range:date_range_array})
        .then(response => {
          let fileURL = window.URL.createObjectURL(
            new Blob([response.data], {
              type: "application/vnd.ms-excel",
            }),
          )
          let fileLink = document.createElement("a")

          fileLink.href = fileURL
          fileLink.setAttribute(
            "download",
            `${props.cohort.name} loan report_` + Math.round(+new Date() / 1000) + ".xlsx",
          )
          document.body.appendChild(fileLink)

          fileLink.click()

          ElMessage({
            type: "success",
            message: `${props.cohort.name}  loan report downloaded successfully`,
          })

          closeDialog()
        })
        .catch(err => {
          console.log(err)
          ElMessage({
            type: "error",
            message: "Whoops! something went wrong downloading cohort loan report",
          })
        })
    }
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
  <div class="text-center pa-4">
    <VDialog
      v-model="props.dialog"
      width="500"
    >
      <VCard
        max-width="600"
        prepend-icon="mdi-update"
      >
        <VCardTitle>
          {{ props.title }}
        </VCardTitle>
        <VCardItem>
          <VDateInput
            prepend-icon=""
            v-model="dateRange"
            multiple="range"
            clearable
            label="Select Date Range"
          />
        </VCardItem>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="red"
            @click="closeDialog"
          >
            Close
          </VBtn>

          <VBtn @click="submitDownloadRequest">
            Download
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>

</style>
