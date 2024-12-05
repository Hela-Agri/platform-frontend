<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { formattedErrors } from '@/utils'
import { updateDeposit } from '@/api/deposit'

const props = defineProps<{
  dialog: boolean
  deposit: object
}>()

const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
  (e: 'refresh-deposit'): void
}>()

const form = ref({
  accepted_amount: '',
  requested_amount: props.deposit.amount,
})

watch(
  () => props.deposit.amount,
  newAmount => {
    form.value.requested_amount = newAmount
  },
)

const validateAllowedAmount = () => {
  if (Number(form.value.accepted_amount) > Number(form.value.requested_amount))
    form.value.accepted_amount = form.value.requested_amount

}

// Function to close the dialog
const closeDialog = () => {
  emit('update:dialog', false)
}

const submitData = () => {
  isLoading.value = true
  try {
    const payload = {
      allowed_amount: form.value.accepted_amount,
      requested_amount: form.value.requested_amount,
    }

    updateDeposit(props.deposit.id, payload).then(async response => {
      if (response.status === 200) {
        toast.success(response.data.message)
        closeDialog()
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('refresh-deposit')
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
  <div class="text-center pa-4">
    <!-- Dialog component -->
    <VDialog
      v-model="props.dialog"
      width="auto"
    >
      <VCard
        prepend-icon="bx bx-check-circle"
        title="Off Taker Details"
      >
        <VCardItem>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Name : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ props.deposit.name }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Phone : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle> {{ props.deposit.user.phone_number }} </VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Email : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ props.deposit.user.email }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Wallet Balance : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle> {{ props.deposit.user.wallet.balance }} /= </VCardSubtitle>
            </VCol>
          </VRow>
          <div v-if="props.deposit.status === 'PENDING'">
            <VCardText class="text-center">
              <h5 class="text-h5">
                Approve Amount
              </h5>
            </VCardText>
            <VRow class="mt-1">
              <VForm @submit.prevent="submitData">
                <VRow>
                  <VCol
                    cols="12"
                    md="12"
                  >
                    <VTable>
                      <thead>
                      <tr>
                        <th class="text-left">
                          Requested Amount
                        </th>
                        <th class="text-left">
                          Allowed Amount
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>
                          <VTextField
                            v-model="form.requested_amount"
                            max-width="200px"
                            label="Requested Amount"
                            type="number"
                            readonly
                          />
                        </td>

                        <td>
                          <VTextField
                            v-model="form.accepted_amount"
                            max-width="200px"
                            label="Allowed Amount"
                            type="number"
                            clearable
                            @input="validateAllowedAmount"
                          />
                        </td>
                      </tr>
                      </tbody>
                    </VTable>
                  </VCol>
                </VRow>
                <VDivider />
                <VCardActions>
                  <VSpacer />
                  <VBtn
                    type="submit"
                  >
                    Submit
                    <VIcon
                      icon="bx-save"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </VCardActions>
              </VForm>
            </VRow>
          </div>
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
