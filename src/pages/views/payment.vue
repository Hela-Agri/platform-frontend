<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPayment } from '@/api/payment/index'
import {formatDate, getQuantityColorTagCode} from "@/utils";

const route = useRoute()
const activeTab = ref(route.params.tab)
const payment = ref([])
const loans = ref([])
const paymentUuid = ref('')
const isLoading = ref(false)
const tabs = [
  {
    title: 'Loans',
    icon: 'bx-money',
    tab: 'loan',
  }
]


onMounted(async () => {
  paymentUuid.value = route.params.uuid
  await fetchFarmer()
})

const fetchFarmer = async () => {
  isLoading.value = true
  try {
    getPayment(paymentUuid.value).then(response => {
      if (response.data.success) {
        payment.value = response.data?.data
        loans.value = response.data?.data?.loans
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
</script>

<template>
  <VRow>
    <VCol md="4">
      <VSkeletonLoader
        v-if="payment.length === 0"
        class="mx-auto"
        elevation="12"
        max-width="500"
        type="table-heading, list-item-two-line, image, table-tfoot"
      />

      <VCard v-else>
        <VCardItem>
          <h5 class="text-h5 mb-4">
            Details
          </h5>
          <VDivider />
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Payment Mode: </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ payment?.payment_mode?.name }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Reference Number: </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ payment?.transaction_reference }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Paid Amount: </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ payment?.paid_amount }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Balance : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ payment?.balance }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Payment Date : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ formatDate(payment.transaction_date) }}</VCardSubtitle>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol md="8">
      <div>
        <VTabs
          v-model="activeTab"
          show-arrows
        >
          <VTab
            v-for="item in tabs"
            :key="item.icon"
            :value="item.tab"
          >
            <VIcon
              size="20"
              start
              :icon="item.icon"
            />
            {{ item.title }}
          </VTab>
        </VTabs>
        <VDivider />

        <VWindow
          v-model="activeTab"
          class="mt-5 disable-tab-transition"
        >

          <!-- Loans -->
          <VWindowItem value="loan">
            <VTable class="text-no-wrap">
              <thead>
              <tr>
                <th>Loan Code</th>
                <th>Farmer  Name</th>
                <th>Principle(Kes)</th>
                <th>Interest Amount(Kes)</th>
                <th>Processing Fee(Kes)</th>
                <th>Total(Kes)</th>
                <th>Balance(Kes)</th>
                <th>Status</th>
                <th>Date Issued</th>
              </tr>
              </thead>

              <tbody>
              <tr
                v-for="item in loans"
                :key="item.id"
              >
                <td>{{ item.code }}</td>
                <td>{{ `${item?.farmer?.first_name} ${item?.farmer?.middle_name} ${item?.farmer?.last_name}` }}</td>
                <td>{{ item.sub_total }}</td>
                <td>{{ item.interest }}</td>
                <td>{{ item.processing_fee }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.balance }}</td>
                <td>
                  <VChip :color="getQuantityColorTagCode(item.status.code)">
                    {{ item.status.code }}
                  </VChip>
                </td>
                <td>{{ formatDate(item.approval_date) }}</td>
              </tr>
              </tbody>
            </VTable>
          </VWindowItem>
        </VWindow>
      </div>
    </VCol>
  </VRow>
</template>
