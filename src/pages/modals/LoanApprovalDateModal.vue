<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { updateLoanDate } from '@/api/loan'

const props = defineProps<{
  dialog: boolean
  itemId: string
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh'): void
}>()

const isLoading = ref(false)
const approvalDate = ref(new Date())

const closeDialog = () => {
  emit('update:dialog', false)
}

const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }).split('T')[0]
}

const approveFarmActivity = () => {
  try {
    if (isLoading.value)
      return
    isLoading.value = true
    const formattedDate = formatDate(approvalDate.value)

    updateLoanDate(props.itemId, { approval_date: formattedDate }).then(async response => {
      if (response.status === 200) {
        toast.success(response.data.message)
        emit('refresh')
      }
      else {
        toast.error(response.data.message)
      }
      closeDialog()
    })
  }
  catch (error) {
    console.error(error)
    toast.error('An error occurred while approving the activity')
    closeDialog()
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
      width="500px"
    >
      <VCard
        max-width="600"
        prepend-icon="mdi-update"
      >
        <VCardTitle>
          Approval Date
        </VCardTitle>
        <VCardItem>
          <VDateInput
            v-model="approvalDate"
            clearable
            label="Approval Date"
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

          <VBtn
            :loading="isLoading"
            color="primary"
            @click="approveFarmActivity"
          >
            Approve
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
