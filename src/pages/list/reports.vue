<script setup lang="ts">
import { hasPermission } from "@/utils"
import { ref } from 'vue'
import ReportModal from '@/pages/modals/ReportModal.vue'

const reportDialog = ref<boolean>(false)
// eslint-disable-next-line camelcase
const report_type = ref<string>('')
// eslint-disable-next-line camelcase
const report_label = ref<string>('')
const title = ref<string>('')

const reports = [
  {
    name: 'Yield Report',
    type: 'farmer_yields',
    label: 'yields',
    path: 'yields',
    desc: 'This reports shows the total Yields Per Farmer for a given period',
  },
  {
    name: 'Loan Report',
    type: 'monthly_loans',
    label: 'monthly_loans',
    path: 'loans',
    desc: 'This reports shows the total Yields Per Farmer for a given period',
  },
  {
    name: 'Wallet Statement',
    type: 'wallet_statement',
    label: 'wallet_statement',
    path: 'wallet-statement',
    desc: 'This reports shows all the transactions for a specific wallet.',
  },
]

const triggerReportDialog = item => {
  title.value = `${item.name} report`
  report_type.value = item.type
  reportDialog.value = true
  report_label.value = item.label
}
</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Description
        </th>
        <th class="text-left">
          Download
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in reports"
        :key="item.name"
      >
        <td>{{ item.name }}</td>
        <td>{{ item.desc }}</td>
        <td class="text-info">
          <VMenu>
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                variant="tonal"
                icon="bx bx-dots-vertical-rounded"
              />
            </template>
            <VList>
              <VListItem
                v-if="hasPermission('list.report')"
                @click="triggerReportDialog(item)"
              >
                <IconBtn> <VIcon icon="bx bx-download" /> </IconBtn>Download
              </VListItem>
              <VListItem
                v-if="hasPermission('view.report')"
                :href="`/report/${item.path}`"
              >
                <IconBtn> <VIcon icon="bx bx-search" /> </IconBtn>View
              </VListItem>
            </VList>
          </VMenu>
        </td>
      </tr>
    </tbody>
  </VTable>

  <ReportModal
    :dialog="reportDialog"
    :report-type="report_type"
    :report-label="report_label"
    description="Select Report Date Range"
    :title="title"
    @update:dialog="reportDialog = $event"
  />
</template>

<style scoped>

</style>
