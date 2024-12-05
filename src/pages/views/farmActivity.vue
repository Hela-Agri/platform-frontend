<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { VIcon } from 'vuetify/components'
import AddFarmActivityYieldModal from '@/pages/modals/addFarmActivityYieldModal.vue'
import {
  downloadActivityStatement,
  getFarmerActivity,
  removeFarmActivityItem,
  removeFarmActivityYield,

} from '@/api/farmer/index'
import AddFarmActivityItemModal from '@/pages/modals/FarmActivityItemModal.vue'
import ApproveFarmActivityModal from '@/pages/modals/approveFarmActivityModal.vue'
import ViewFarmLocationModal from '@/pages/modals/viewFarmLocationModal.vue'
import ViewImagesModal from '@/pages/modals/viewImagesModal.vue'
import ViewLoanPackageModal from '@/pages/modals/viewLoanPackageModal.vue'

import ViewCohortModal from '@/pages/modals/viewCohortModal.vue'
import { formatDate, hasPermission } from '@/utils/index'

const route = useRoute()
const activeTab = ref(route.params.tab)
const activityId = ref()
const activity = ref([])
const product = ref([])
const cohort = ref([])
const activityItems = ref([])
const site_visits = ref([])
const yields = ref([])
const isLoading = ref(false)
const dialog = ref(false)
const addItemDialog = ref(false)
const addYieldDialog = ref(false)
const approveActivityDialog = ref(false)
const cohortDialog = ref(false)
const mapDialong = ref(false)
const imageDialog = ref(false)
const colors = []
let latlong = { lat: '', long: '' }
const images = []
const activityItem = ref({})
const canApprove = ref(false);
onMounted(async () => {
  activityId.value = route.params.uuid
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchFarmActivity()
  colors.critical = 'error'
  colors.high = 'warning'
  colors.medium = 'info'
  colors.low = 'primary'
})

const openAddItemDialog = item => {
  addItemDialog.value = true
  activityItem.value = item ?? {}
}

const openAddYieldDialog = () => {
  addYieldDialog.value = true
}

const approveActivity = () => {
  approveActivityDialog.value = true
}

const openPackageDialog = pkg => {
  dialog.value = true
  product.value = pkg
}

const openCohortDialog = pjk => {
  cohortDialog.value = true
  cohort.value = pjk
}

const openImageDialog = imgs => {
  imgs.forEach(img => {
    images.push(img.path)
  })
  imageDialog.value = true
}

const openMapDialog = _latlong => {
  mapDialong.value = true
  latlong = _latlong
}

const fetchFarmActivity = async () => {
  isLoading.value = true
  try {
    getFarmerActivity(activityId.value).then(response => {
      if (response.data.success) {
        activity.value = response.data?.data
        activityItems.value = response.data?.data?.activity_items
        yields.value = response.data?.data?.harvests
        site_visits.value = response.data?.data?.site_visits
        canApprove.value = activity?.value?.status?.name === 'Pending'
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

const printActivityStatement = async () => {
  isLoading.value = true
  try {
    downloadActivityStatement(activityId.value).then(response => {
      isLoading.value = false
      if (response.status == 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', `invoice-${activity.value.invoice_number}.pdf`)
        document.body.appendChild(link)
        link.click()
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

const headers = [
  { title: 'ITEM NAME', key: 'name' },
  { title: 'ITEM TYPE', key: 'item_type' },
  { title: 'UNIT PRICE', key: 'unit_price' },
  { title: 'QUANTITY', key: 'quantity' },
  { title: 'TOTAL', key: 'total' },
  { title: 'DATE ISSUED', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const yieldHeaders = [
  { title: 'DATE', key: 'harvest_date' },
  { title: 'WEIGHT', key: 'weight' },
  { title: 'CREATED AT', key: 'created_at' },
  { title: 'ACTION', key: 'action' },
]

const formattedActivityItems = computed(() => {
  return activityItems.value.map(item => ({
    ...item,
    name: item.rate_card?.name || '',
    item_type: item.rate_card?.item_type || '',
    unit_price: item.rate_card?.amount || 0,
    created_at: formatDate(item.date),
  }))
})

const formattedActivityYields = computed(() => {
  return yields.value.map(item => ({
    ...item,
    weight: `${item.weight} ${item?.unit?.name}` || '',
    harvest_date: formatDate(item.harvest_date),
    created_at: formatDate(item.created_at),
  }))
})

// tabs
const tabs = [
  {
    title: 'Activity Items',
    icon: 'bx bx-list-plus',
    tab: 'items',
  },
  {
    title: 'Farm Visits',
    icon: 'bx bx-list-plus',
    tab: 'site_visits',
  },
  {
    title: 'Yields',
    icon: 'bx bxl-mongodb',
    tab: 'yields',
  },
  {
    title: 'Wallet Transactions',
    icon: 'bx bx-trending-up',
    tab: 'wallet',
  },
]

const deleteFarmActivityItem = async uuid => {
  try {
    removeFarmActivityItem(uuid).then(response => {
      if (response.data.success)
        toast.success(response.data.message)
      else console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const deleteFarmActivityYield = async uuid => {
  try {
    removeFarmActivityYield(uuid).then(response => {
      if (response.data.success)
        toast.success(response.data.message)
      else console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <VRow>
    <VCol md="4">
      <VCard>
        <VCardItem>
          <VCardTitle />
          <VCardTitle class="d-flex justify-space-between">
            <VCol cols="auto">
              <VBtn
                v-if="canApprove"
                prepend-icon="bx bx-check-double"
                size="small"
                @click="approveActivity"
              >
                Approve
              </VBtn>
            </VCol>
            <VCol cols="auto">
              <VMenu>
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="tonal"
                    icon="bx bx-dots-vertical-rounded"
                  />
                </template>
                <VList>
                  <VListItem @click="printActivityStatement">
                    <IconBtn> <VIcon icon="bx bx-printer" /> </IconBtn> Print Statement
                  </VListItem>
                </VList>
              </VMenu>
            </VCol>
          </VCardTitle>
        </VCardItem>
        <VCardItem>
          <h5 class="text-h5 mb-4">
            Farm Activity Details
          </h5>
          <VDivider />
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Farmer Names : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>
                {{
                  `${activity?.farm?.user?.first_name}`
                    + " "
                    + `${activity?.farm?.user?.middle_name}`
                    + " "
                    + `${activity?.farm?.user?.last_name}`
                }}
              </VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Farm : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>
                {{ `${activity?.farm?.location}` + ", " + `${activity?.farm?.size}` }}
              </VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Cohort : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>
                {{ activity?.cohort?.name }}
                <IconBtn>
                  <VIcon
                    icon="bx bx-check-circle"
                    @click="openCohortDialog(activity?.cohort)"
                  />
                </IconBtn>
              </VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Loan Product : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>
                {{ activity?.package?.name }}
                <IconBtn>
                  <VIcon
                    icon="bx bx-check-circle"
                    @click="openPackageDialog(activity?.package)"
                  />
                </IconBtn>
              </VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Loan Amount : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ activity?.activity_items_sum_total }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Start Date : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ formatDate(activity?.start_date) }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>End Date : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ formatDate(activity?.end_date) }}</VCardSubtitle>
            </VCol>
          </VRow>

          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Status : </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>
                <VChip color="green">
                  {{ activity?.status?.code }}
                </VChip>
              </VCardSubtitle>
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
          <!-- items -->
          <VWindowItem value="items">
            <VCard>
              <VCardItem class="justify-end">
                <VBtn
                  color="info"
                  size="small"
                  prepend-icon="bx bx-plus"
                  @click="openAddItemDialog"
                >
                  Add Item
                </VBtn>
              </VCardItem>
              <VCardItem>
                <div class="table-container">
                  <VDataTable
                    :headers="headers"
                    :items="formattedActivityItems"
                    :items-per-page="10"
                    height="auto"
                    fixed-header
                  >
                    <template #item.action="{ item }">
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
                            v-if="hasPermission('edit.farm_activity')"
                            @click="openAddItemDialog(item)"
                          >
                            <IconBtn>
                              <VIcon
                                icon="bx bx-pencil"
                                class="text-primary"
                              />
                            </IconBtn><span class="text-primary">Edit</span>
                          </VListItem>
                          <VListItem
                            v-if="hasPermission('delete.farm_activity')"
                            @click="deleteFarmActivityItem(`${item.id}`)"
                          >
                            <IconBtn>
                              <VIcon
                                icon="bx bx-trash"
                                class="text-error"
                              />
                            </IconBtn><span class="text-error">Delete</span>
                          </VListItem>
                        </VList>
                      </VMenu>
                    </template>
                  </VDataTable>
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
                </div>
              </VCardItem>
            </VCard>
          </VWindowItem>
          <!-- visits -->
          <VWindowItem value="site_visits">
            <div class="table-container">
              <VTable>
                <thead>
                  <tr>
                    <th class="text-left">
                      Action
                    </th>
                    <th class="text-left">
                      Visited By
                    </th>
                    <th class="text-left">
                      Remarks
                    </th>
                    <th class="text-left">
                      Urgency
                    </th>
                    <th class="text-left">
                      Location
                    </th>
                    <th class="text-left">
                      Images
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {{
                    activityItems.site_visits
                  }}
                  <tr
                    v-for="site_visit in site_visits"
                    :key="site_visit.id"
                  >
                    <td>{{ site_visit?.action?.name }}</td>
                    <td>
                      {{ site_visit?.user?.first_name }}
                      {{ site_visit?.user?.middle_name }}
                      {{ site_visit?.user?.last_name }}
                    </td>
                    <td>{{ site_visit?.remarks }}</td>

                    <td>
                      <VChip
                        variant="tonal"
                        size="x-small"
                        :color="colors[`${site_visit?.urgency}`]"
                      >
                        {{ site_visit?.urgency }}
                      </VChip>
                    </td>
                    <td>
                      <VBtn
                        size="small"
                        icon="bx-map"
                        variant="outlined"
                        color="success"
                        @click="
                          openMapDialog({
                            lat: parseFloat(site_visit?.latitude, 10),
                            lng: parseFloat(site_visit?.longitude, 10),
                          })
                        "
                      />
                    </td>
                    <td>
                      <VBtn
                        size="small"
                        icon="bx-images"
                        variant="outlined"
                        color="success"
                        @click="openImageDialog(site_visit?.uploads)"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>
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
            </div>
          </VWindowItem>
          <!-- yields -->
          <VWindowItem value="yields">
            <VCard>
              <VCardItem class="justify-end">
                <VBtn
                  color="info"
                  size="small"
                  prepend-icon="bx bx-plus"
                  @click="openAddYieldDialog"
                >
                  Record Yield
                </VBtn>
              </VCardItem>
              <VCardItem>
                <div class="table-container">
                  <VDataTable
                    :headers="yieldHeaders"
                    :items="formattedActivityYields"
                    :items-per-page="10"
                    height="auto"
                    fixed-header
                  >
                    <template #item.action="{ item }">
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
                            v-if="hasPermission('delete.yield')"
                            @click="deleteFarmActivityYield(`${item.id}`)"
                          >
                            <IconBtn>
                              <VIcon
                                icon="bx bx-trash"
                                class="text-error"
                              />
                            </IconBtn><span class="text-error">Delete</span>
                          </VListItem>
                        </VList>
                      </VMenu>
                    </template>
                  </VDataTable>
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
                </div>
              </VCardItem>
            </VCard>
          </VWindowItem>
          <!-- wallet -->
          <VWindowItem value="wallet">
            wallet
          </VWindowItem>
        </VWindow>
      </div>
    </VCol>
  </VRow>
  <ViewLoanPackageModal
    :dialog="dialog"
    :product="product"
    @update:dialog="dialog = $event"
  />
  <ViewCohortModal
    :dialog="cohortDialog"
    :cohort="cohort"
    @update:dialog="cohortDialog = $event"
  />
  <ViewFarmLocationModal
    :dialog="mapDialong"
    :latlong="latlong"
    @update:dialog="mapDialong = $event"
  />
  <ViewImagesModal
    :dialog="imageDialog"
    :images="images"
    @update:dialog="imageDialog = $event"
  />
  <AddFarmActivityItemModal
    :dialog="addItemDialog"
    :activity="activity"
    :farm-activity-item="activityItem"
    @refresh-farm-activity="fetchFarmActivity"
   @update:dialog="addItemDialog = $event"/>
  <AddFarmActivityYieldModal
    :dialog="addYieldDialog"
    :activity="activity"
    @refresh-farm-activity="fetchFarmActivity"
    @update:dialog="addYieldDialog = $event"
  />
  <ApproveFarmActivityModal
    :dialog="approveActivityDialog"
    :activity="activity"
    description="The farm activity will be approved and loan will be activated."
    title="Approve Farm Activity"
    activities=""
    :multiple="false"
    @update:dialog="approveActivityDialog = $event"
    @refresh="fetchFarmActivity"
  />
</template>

<style scoped>
.table-container {
  position: relative;
}

.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 80%);
  block-size: 100%;
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
}
</style>
