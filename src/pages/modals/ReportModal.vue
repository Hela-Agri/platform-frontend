<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { defineEmits, defineProps, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import {downloadYieldReport, downloadLoanReport, downloadWalletStatement} from '@/api/report'

const props = defineProps<{
  dialog: boolean,
  reportType: string
  description: string
  title: string
  reportLabel: string
}>()
const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh'): void
}>()
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
  const dates = dateRange.value.map(date => new Date(date))
  const startDate = new Date(Math.min(...dates))
  const endDate = new Date(Math.max(...dates))

  const date_range_array = [
    startDate,
    endDate,
  ]

  try {
    isLoading.value = true

    let downloadRequest
    if (props.reportType === 'farmer_yields'){
      downloadYieldReport({ date_range: date_range_array }).then(response => {
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], {
            type: 'application/vnd.ms-excel',
          }),
        )

        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute(
          'download',
          `${props.reportLabel}_${Math.round(+new Date() / 1000)}.xlsx`,
        )
        document.body.appendChild(fileLink)

        fileLink.click()

        ElMessage({
          type: 'success',
          message: 'Yield Report downloaded successfully',
        })

        closeDialog()
      })
        .catch(err => {
          console.log(err)
          ElMessage({
            type: 'error',
            message: 'Whoops! something went wrong downloading Yield report',
          })
        })
    }

    if (props.reportType === 'wallet_statement'){
      downloadWalletStatement({ date_range: date_range_array }).then(response => {
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], {
            type: 'application/vnd.ms-excel',
          }),
        )

        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute(
          'download',
          `${props.reportLabel}_${Math.round(+new Date() / 1000)}.xlsx`,
        )
        document.body.appendChild(fileLink)

        fileLink.click()

        ElMessage({
          type: 'success',
          message: 'Loan Report downloaded successfully',
        })

        closeDialog()
      })
        .catch(err => {
          console.log(err)
          ElMessage({
            type: 'error',
            message: 'Whoops! something went wrong downloading Loan report',
          })
        })
    }

    if (props.reportType === 'monthly_loans'){
      downloadLoanReport({ date_range: date_range_array }).then(response => {
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], {
            type: 'application/vnd.ms-excel',
          }),
        )

        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute(
          'download',
          `${props.reportLabel}_${Math.round(+new Date() / 1000)}.xlsx`,
        )
        document.body.appendChild(fileLink)

        fileLink.click()

        ElMessage({
          type: 'success',
          message: 'Loan Report downloaded successfully',
        })

        closeDialog()
      })
        .catch(err => {
          console.log(err)
          ElMessage({
            type: 'error',
            message: 'Whoops! something went wrong downloading Loan report',
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
            v-model="dateRange"
            prepend-icon=""
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
