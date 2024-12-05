<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import moment from 'moment'
import { VTextField } from "vuetify/components"
import { addDeposit } from '@/api/deposit'
import { router } from '@/plugins/router'
import { fetchUsers } from '@/api/user'
import { formattedErrors } from '@/utils'

interface Filter {
  [key: string]: any
}
const isLoading = ref<boolean>(false)
const users = ref([])
const filter = ref([])
const refDepositForm = ref()
// eslint-disable-next-line @typescript-eslint/no-shadow
const fetchOffTakers = async (filter?: Filter, page?: number): Promise<void> => {
  isLoading.value = true

  // eslint-disable-next-line camelcase
  let entity_params: Filter = {}
  try {
    if (filter === undefined) {
      // eslint-disable-next-line camelcase
      entity_params = {}
    }
    else {
      // eslint-disable-next-line camelcase
      entity_params = filter
    }
    const response = await fetchUsers(entity_params, page ?? 1)

    users.value = response.data?.data?.data.map(user => ({
      ...user,
      name: `${user?.first_name} ${user?.middle_name} ${user?.last_name}`.trim(),
    }))
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  filter.value.role_type = 'off_taker'
  fetchOffTakers(filter, 1)
})

const form = ref({
  amount: '',
  user_id: '',
  date: moment().format('YYYY-MM-DD')
})

const submitForm = async () => {
  refDepositForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      try {
        isLoading.value = true
        addDeposit({
          amount: form.value.amount,
          user_id: form.value.user_id,
          date: form.value.date,
        }).then (async response => {
          if (response.status === 200) {
            isLoading.value = false
            toast.success(response.data.message)
            await router.replace('/list/deposits')

          }
          else {
            isLoading.value = false
            toast.error(formattedErrors(response.data.errors))
          }
        })
      }
      catch (error) {
        isLoading.value = false
        console.log(error)
      }
    }
  })
}

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value)
      return true

    return 'Field is required.'
  },
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Deposit Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm  ref="refDepositForm" @submit.prevent="submitForm">
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <VSelect
                v-model="form.user_id"
                label="Select Off Taker"
                :items="users"
                placeholder="Off Taker"
                item-title="name"
                item-value="id"
                validate-on="submit"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="form.amount"
                label="Deposit Amount"
                type="number"
                placeholder="Deposit Amount"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="form.date"
                label="Deposit Date"
                placeholder="Deposit Date"
                type="date"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>



            <VCol
              cols="12"
              class="d-flex gap-4"
            >
              <VBtn
                :loading="isLoading"
                type="submit"
              >
                Submit
              </VBtn>

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                href="/list/deposits"
              >
                Back
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCol>
    </VCard>
  </VCard>
</template>
