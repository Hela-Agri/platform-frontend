<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {toast} from 'vue3-toastify'
import {ElMessage, ElNotification} from 'element-plus'
import {useRoute, useRouter} from 'vue-router'
import {addPayment, getPayment, getPaymentMethods, updatePayment,} from '@/api/payment'
import {fetchUsers} from '@/api/user'
import {fetchLoans} from '@/api/loan'
import {getFarmers} from '@/api/farmer'
import {formatDate} from '@/utils'
import {getCohorts} from "@/api/cohort";

const form = ref({
  transaction_date: '',
  transaction_reference: '',
  payment_mode_id: '',
  notes: '',
  received_amount: '',
  allocated_amount: '',
})

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const isLoading = ref(false)
const modes = ref([])
const loans = ref([])
const farmers = ref([])
const cohorts = ref([])
const selector = ref([])
const payment = ref([])
const users = ref([])
const paymentId = ref()
// eslint-disable-next-line camelcase
const date_range = ref([])
// eslint-disable-next-line camelcase
const selected_loans = ref([])
// eslint-disable-next-line camelcase
const loan_number = ref('')
const cohort_id = ref('')
// eslint-disable-next-line camelcase
const farmer_id = ref('')
// eslint-disable-next-line camelcase
const off_taker_id = ref('')

interface Filter {
  [key: string]: any
}

const fetchCohorts = async entity_params => {
  isLoading.value = true
  try {
    getCohorts(entity_params).then(response => {
      if (response.data.success) {
        cohorts.value = response.data?.data?.data.map((cohort: any) => ({
          value: `${cohort.id}`,
          label: `${cohort.name}`.trim(),
        }))
      }
      else {
        console.log(response)
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

const fetchFarmers = async entity_params => {
  isLoading.value = true
  try {
    getFarmers(entity_params).then(response => {
      if (response.data.success) {
        farmers.value = response.data?.data?.data.map((farmer: any) => ({
          id: `${farmer.id}`,
          name: `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name} - (${farmer.phone_number})`.trim(),
        }))
      }
      else {
        console.log(response)
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

const getPaymentModes = async (): Promise<void> => {
  try {
    await getPaymentMethods().then(response => {
      if (response.data.success) {
        modes.value = response.data.data.data

        form.value.payment_mode_id = payment.value.payment_mode_id
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


const offTakerSearcher = search => {
  farmer_id.value=''
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search,
    searchFields: 'first_name:like;last_name:like;middle_name:like;phone_number:like;',
  }

  fetchOffTakers(entity_params)
}

const offTakerCleared = () => {
  off_taker_id.value=''
  farmer_id.value=''
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
  }
  fetchOffTakers(filter)
}

const farmerSearcher = search => {
  farmer_id.value=''
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search,
    searchFields: 'first_name:like;last_name:like;middle_name:like;phone_number:like;',
  }

  fetchFarmers(entity_params)
}

const cohortSearcher = search => {
  farmer_id.value=''
  const entity_params = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc',
    search,
    searchFields: 'name:like;duration:like;',
  }

  fetchCohorts(entity_params)
}

const cohortCleared = () => {
  farmer_id.value=''
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
  }
  fetchCohorts(filter)
}

const farmerCleared = () => {
  const filter = {
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
  }
  fetchFarmers(filter)
}

const fetchOffTakers = async (entity_params: any): Promise<void> => {
  isLoading.value = true

  try {
    await fetchUsers(entity_params).then(response => {
      if (response.data.success) {
        users.value = response.data?.data?.data.map((user: any) => ({
          id: `${user.id}`,
          name: `${user.first_name} ${user.middle_name} ${user.last_name} - (${user.phone_number})`.trim(),
        }))
      }
      else {
        console.log(response)
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

const fetchData = async (entity_params) => {
  isLoading.value = true

  try {

    const response = await fetchLoans(entity_params)

    loans.value = response.data.data.data
  }
  catch (error) {
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

const fetchPayment = async () => {
  isLoading.value = true
  try {
    getPayment(paymentId.value).then(response => {
      if (response.data.success) {
        payment.value = response.data?.data

        form.value.received_amount = payment.value.balance
        form.value.transaction_date = payment.value.transaction_date
        form.value.notes = payment.value.notes
        form.value.transaction_reference = payment.value.transaction_reference

        const loanFilter = {
          page: 1,
          balance: true,
          orderBy: 'created_at',
          sortedBy: 'desc'
        }
        fetchData(loanFilter)

        getPaymentModes()
        const filter = {
          page: 1,
          orderBy: 'created_at',
          sortedBy: 'desc'
        }
        fetchFarmers(filter)
        fetchOffTakers(filter)
      }
      else {
        console.log(response)
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

onMounted(() => {
  paymentId.value = route.params.uuid

  if (paymentId.value) {
    fetchPayment()
  }
  else {
    const loanFilter = {
      page: 1,
      balance: true,
      orderBy: 'created_at',
      sortedBy: 'desc'
    }
    fetchData(loanFilter)

    getPaymentModes()

    const filter = {
      page: 1,
      orderBy: 'created_at',
      sortedBy: 'desc'
    }
    fetchCohorts(filter)
    fetchFarmers(filter)
    fetchOffTakers(filter)
  }
})

const loadLoans = () => {

  const loanFilter = {
    page: 1,
    farmer_id: farmer_id.value,
    cohort_id: cohort_id.value,
    off_taker_id: off_taker_id.value,
    date_range: date_range.value,
    code: loan_number.value,
    balance: true,
    orderBy: 'created_at',
    sortedBy: 'desc'
  }

  fetchData(loanFilter)

}

// eslint-disable-next-line camelcase
selected_loans.value.splice(0)

const selectAll = computed({
  get() {
    if (loans.value !== null && loans.value.length > 0) {
      let allChecked = true

      for (const loan of loans.value) {
        // eslint-disable-next-line camelcase
        if (!selected_loans.value.includes(loan))
          allChecked = false

        if (!allChecked)
          break
      }

      return allChecked
    }

    return false
  },
  set(value) {
    const checked = []
    if (value) {
      loans.value.forEach(loan => {
        checked.push(loan)
      })
    }
    // eslint-disable-next-line camelcase
    selected_loans.value = checked
  },
})

const enrichedSelectedLoans = computed(() => {
  // eslint-disable-next-line camelcase
  return selected_loans.value.map(loan => ({
    ...loan,
    repaid_amount: loan.balance,
  }))
})

const removeItem = index => {
  // eslint-disable-next-line camelcase
  selected_loans.value.splice(index, 1)
}

watch(
  enrichedSelectedLoans,
  newLoans => {
    form.value.allocated_amount = newLoans.reduce((sum, loan) => sum + (loan.repaid_amount || 0), 0)
  },
  { deep: true },
)

const calculateOverallTotal = () => {
  form.value.allocated_amount = enrichedSelectedLoans.value.reduce(
    (total, item) => total + item.repaid_amount,
    0,
  ).toFixed(2)

  return form.value.allocated_amount
}

const numberFormat = value => {
  const val = (value / 1).toFixed(2)

  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const submitForm = async () => {
  loading.value = true

  if (Number(form.value.received_amount) < Number(form.value.allocated_amount)) {
    ElMessage({
      type: 'error',
      message: 'Allocated amount cannot be greater than received amount !',
    })
    loading.value = false

    return false
  }

  const loanData = enrichedSelectedLoans.value.map(loan => ({
    id: loan.id,
    repaid_amount: loan.repaid_amount,
  }))

  const payload = {
    paid_amount: form.value.received_amount,
    allocated_amount: form.value.allocated_amount,
    transaction_date: form.value.transaction_date,
    notes: form.value.notes,
    transaction_reference: form.value.transaction_reference,
    payment_mode_id: form.value.payment_mode_id,
    selected_loans: loanData,
  }

  try {
    if (paymentId.value) {
      updatePayment(paymentId.value, payload).then(async (response) => {
        if (response.data.success) {
          toast.success(response.data.message)
          await router.replace('/list/payments')
        } else {
          Object.values(response.data.errors).forEach((val) =>
            ElNotification({
              title: "Error",
              message: val[0],
              type: "error",
            })
          );
        }
      }).catch((err) => {
        ElNotification({
          title: "Error",
          message: err.message,
          type: "error",
        });
      }).finally(() => {
        loading.value = false;
      })
    }
    else {
      addPayment(payload).then(async (response) => {
        if (response.data.success) {
          toast.success(response.data.message)
          await router.replace('/list/payments')
        } else {

          Object.values(response.data.errors).forEach((val) =>
            ElNotification({
              title: "Error",
              message: val[0],
              type: "error",
            })
          );
        }
      }).catch((err) => {
        ElNotification({
          title: "Error",
          message: err.message,
          type: "error",
        });
      }).finally(() => {
        loading.value = false;
      })
    }
  }
  catch (error) {
    loading.value = false
    console.log(error)
  }
  finally {
    loading.value = false
  }
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
    <VCol>
      <VForm @submit.prevent="submitForm">
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VCard
              class="mx-auto my-8"
              elevation="16"
              max-width="100%"
            >
              <VCardItem>
                <VCardTitle>
                  Payment Details
                </VCardTitle>
              </VCardItem>

              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    md="12"
                  >
                    <VTextField
                      v-model="form.transaction_reference"
                      label="Transaction Reference"
                      placeholder="Transaction Reference"
                      validate-on="submit"
                      :rules="requiredRule"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="12"
                  >
                    <ElDatePicker
                      v-model="form.transaction_date"
                      type="date"
                      style="width: 100%;"
                      placeholder="Pick payment date"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="12"
                  >
                    <VSelect
                      v-model="form.payment_mode_id"
                      label="Select Payment Mode"
                      placeholder="Select Payment Mode"
                      :items="modes"
                      item-title="name"
                      item-value="id"
                      validate-on="submit"
                      :rules="requiredRule"
                    />
                  </VCol>
                  <VCard
                    class="mx-auto my-8"
                    elevation="16"
                    max-width="100%"
                  >
                    <VCardItem>
                      <VCardSubtitle>
                        Select Loan To Pay
                      </VCardSubtitle>
                    </VCardItem>
                    <VCardText>
                      <VCol
                        cols="12"
                        md="12"
                      >
                        <VRow>
                          <VCol
                            cols="12"
                            md="12"
                          >
                            <label
                              for="date-range-picker"
                              class="custom-label"
                            >Filter Loan By Date Range</label>
                            <ElFormItem>
                              <ElDatePicker
                                v-model="date_range"
                                type="daterange"
                                unlink-panels
                                range-separator="To"
                                start-placeholder="Start date"
                                end-placeholder="End date"
                                format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD"
                                @change="loadLoans"
                              />
                            </ElFormItem>
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VAutocomplete
                              v-model="off_taker_id"
                              :items="users"
                              :loading="loading"
                              label="Select Loan By OffTaker"
                              item-title="name"
                              item-value="id"
                              clearable
                              variant="outlined"
                              validate-on="submit"
                              @click:clear="offTakerCleared"
                              @update:search="offTakerSearcher"
                              @update:model-value="loadLoans"
                            >
                            </VAutocomplete>

                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VAutocomplete
                              v-model="farmer_id"
                              :items="farmers"
                              :loading="loading"
                              label="Select Loan By Farmer"
                              item-title="name"
                              item-value="id"
                              clearable
                              variant="outlined"
                              validate-on="submit"
                              @click:clear="farmerCleared"
                              @update:search="farmerSearcher"
                              @update:model-value="loadLoans"
                            >
                            </VAutocomplete>
                          </VCol>

                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VAutocomplete
                              v-model="cohort_id"
                              :items="cohorts"
                              :loading="loading"
                              label="Select Loan By Cohort"
                              item-title="label"
                              item-value="value"
                              clearable
                              variant="outlined"
                              validate-on="submit"
                              @click:clear="cohortCleared"
                              @update:search="cohortSearcher"
                              @update:model-value="loadLoans"
                            >
                            </VAutocomplete>
                          </VCol>

                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="loan_number"
                              label="Search By Loan Number"
                              placeholder="Search By Loan Number"
                              type="text"
                              @input="loadLoans"
                            />
                          </VCol>
                          <VCol
                            class="table_filter"
                            cols="12"
                            md="12"
                          >
                            <table class="selected-items-table">
                              <thead>
                              <th class="">
                                <input
                                  v-model="selectAll"
                                  type="checkbox"
                                >
                              </th>
                              <th>Loan No.</th>
                              <th>Farmer Name</th>
                              <th>Principal</th>
                              <th>Interest</th>
                              <th>Total</th>
                              <th>Balance</th>
                              <th>Loan Date</th>
                              </thead>
                              <tbody>
                              <tr
                                v-for="(item, index) in loans"
                                :key="item.id + index"
                                :class="
                                      selected_loans.filter(function (ln) {
                                        if (ln.id === item.id) {
                                          return ln;
                                        }
                                      }).length > 0
                                        ? 'highlightedRow'
                                        : ''
                                    "
                              >
                                <td>
                                  <input
                                    v-model="selected_loans"
                                    type="checkbox"
                                    :value="item"
                                    number
                                  >
                                </td>
                                <td>{{ item.code }}</td>
                                <td>
                                  {{
                                    `${item?.farmer?.first_name} ${item?.farmer?.middle_name} ${item?.farmer?.last_name}`
                                  }}
                                </td>
                                <td>{{ numberFormat(item.sub_total) }}</td>
                                <td>
                                  {{ numberFormat(item.interest) }}
                                </td>
                                <td>
                                  {{
                                    numberFormat(item.total)
                                  }}
                                </td>
                                <td>
                                  {{
                                    numberFormat(item.balance)
                                  }}
                                </td>
                                <td>
                                  {{
                                    formatDate(item?.approval_date)
                                  }}
                                </td>
                              </tr>
                              </tbody>
                              <div
                                v-if="isLoading"
                                class="overlay"
                              >
                                <VProgressCircular
                                  :size="50"
                                  color="primary"
                                  indeterminate
                                />
                              </div>
                            </table>
                          </VCol>
                        </VRow>
                      </VCol>
                    </VCardText>
                  </VCard>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.received_amount"
                      label="Received Amount"
                      placeholder="Received Amount"
                      type="number"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.allocated_amount"
                      label="Allocated Amount"
                      placeholder="Allocated Amount"
                      type="number"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="12"
                  >
                    <VTextarea
                      v-model="form.notes"
                      label="Transaction Note"
                    />
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>

          <VCol
            cols="12"
            md="5"
          >
            <VCard
              class="mx-auto my-8"
              elevation="16"
              max-width="100%"
            >
              <VCardItem>
                <VCardTitle>
                  Allocated Loans
                </VCardTitle>
              </VCardItem>
              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    md="12"
                  >
                    <div class="card-table">
                      <table class="selected-items-table">
                        <thead>
                        <tr>
                          <th>Loan Details</th>
                          <th>Loan Amount</th>
                          <th>Repaid Amount</th>
                          <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                          v-for="(item, index) in enrichedSelectedLoans"
                          :key="index"
                        >
                          <td>
                            Loan Date : {{ formatDate(item?.created_at) }}<br>
                            Loan No : {{ item?.code }}<br>
                            Farmer Name : {{ `${item?.farmer?.first_name} ${item?.farmer?.middle_name} ${item?.farmer?.last_name}` }}
                          </td>
                          <td>{{ item?.total }}</td>
                          <td>
                            <input
                              v-model="item.repaid_amount"
                              class="quantity-input"
                              type="number"
                              @input="calculateOverallTotal"
                            >
                          </td>
                          <td @click="removeItem(index)">
                            <i class="bx bx-trash" />
                          </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                          <td
                            colspan="2"
                            class="total-label"
                          >
                            Total:
                          </td>
                          <td class="total-value">
                            {{ calculateOverallTotal() }}
                          </td>
                          <td />
                        </tr>
                        </tfoot>
                      </table>
                    </div>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            class="d-flex gap-4"
          >
            <VBtn
              :loading="loading"
              type="submit"
            >
              Submit
            </VBtn>
            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
              href="/list/payments"
            >
              Back
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
  </VCard>
</template>

<style scoped>
.card--footer {
  display: flex;
  justify-content: space-between;
  padding: 0 1.2rem 1.2rem 1.2rem !important;
}
.inv_filter_table {
  font-size: 0.75rem;
  background-color: #eef5f3;
  width: 100%;
}
.table_filter {
  display: inline-block;
  overflow-y: scroll;
  max-height: 200px;
}

.inv_filter_table thead th {
  padding: 5px;
  position: sticky; /* make the table heads sticky */
  top: 0px; /* table head will be placed from the top of the table and sticks to it */
}
th {
  background: #eee;
}
.inv_filter_table td {
  padding: 5px;
}
.highlightedRow {
  color: brown;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.card-table {
  max-height: 60vh;
  overflow-y: auto;
}

.selected-items-table {
  font-size: 0.85rem;
  background-color: #eef5f3;
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

.selected-items-table th, .selected-items-table td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.selected-items-table th {
  background-color: #f2f2f2;
}

.quantity-input {
  width: 150px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: right;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.quantity-input:focus {
  border-color: #66afe9;
  outline: none;
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.quantity-input::placeholder {
  color: #ccc;
}
</style>
