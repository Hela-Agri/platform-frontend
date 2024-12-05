<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { approveFarmerActivities, approveFarmerActivity } from '@/api/farmer'

const props = defineProps<{
  dialog: boolean
  activity: object
  multiple: boolean
  activities: any
  description: string
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh'): void
}>()

const isLoading = ref(false)
const approval_date = ref(new Date())

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
    closeDialog()
    const formattedDate = formatDate(approval_date.value)
    if (props.multiple) {
      approveFarmerActivities({ uuids: props.activities,approval_date:formattedDate}).then(async response => {
        if (response.status === 200) {
          toast.success(response.data.message)
          emit('refresh')
        }
        else {
          toast.error(response.data.message)
          closeDialog()
        }
      })
    }
    else {
      approveFarmerActivity(props.activity.id, { approval_date: formattedDate }).then(async response => {
        if (response.status === 200) {
          toast.success(response.data.message)
          closeDialog()
          emit('refresh')
        }
        else {
          toast.error(response.data.message)
          closeDialog()
        }
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
      width="auto"
    >
      <VCard
        max-width="600"
        prepend-icon="mdi-update"
      >
        <VCardTitle>
          {{ props.title }}
        </VCardTitle>
        <VCardSubtitle>
          {{ props.description }}
        </VCardSubtitle>
        <VCardItem>
          <VDateInput
            v-model="approval_date"
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

          <VBtn @click="approveFarmActivity">
            Approve
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>

</style>
