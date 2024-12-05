<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { VCardSubtitle, VCol, VRow } from 'vuetify/components'

const props = defineProps<{
  dialog: boolean
  cohort: object
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
}>()

// Function to close the dialog
const closeDialog = () => {
  emit('update:dialog', false)
}
</script>

<template>
  <div class="text-center pa-4">
    <!-- Dialog component -->
    <VDialog
      v-model="props.dialog"
      width="auto"
    >
      <VCard
        prepend-icon="bx bx-check-circle"
        title="Cohort Details"
      >
        <VCardItem>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Product Name : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ props.cohort.name }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Product Duration : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle> {{ props.cohort.duration }} Day(s) </VCardSubtitle>
            </VCol>
          </VRow>
        </VCardItem>
        <template #actions>
          <VBtn
            class="ms-auto"
            text="Close"
            @click="closeDialog"
          />
        </template>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
