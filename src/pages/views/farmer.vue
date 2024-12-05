<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Password from '../forms/password.vue'
import { getFarmer } from '@/api/farmer/index'
import AddFarmModal from '@/pages/modals/addFarmModal.vue'
import AddKinModal from '@/pages/modals/addKinModal.vue'
import EditFarmerDetailsModal from '@/pages/modals/editFarmerDetailsModal.vue'
import ViewFarmLocationModal from '@/pages/modals/viewFarmLocationModal.vue'

const route = useRoute()
const activeTab = ref(route.params.tab)
const farmer = ref([])
const farms = ref([])
const kins = ref([])
const farmerId = ref('')
const farmerDialog = ref(false)
const farmDialog = ref(false)
const kinDialog = ref(false)
const isLoading = ref(false)
const mapDialong = ref(false)
let latlong = { lat: '', long: '' }
onMounted(async () => {
  farmerId.value = route.params.uuid
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchFarmer()
})

const fetchFarmer = async () => {
  isLoading.value = true
  try {
    getFarmer(farmerId.value).then(response => {
      if (response.data.success) {
        farmer.value = response.data?.data
        farms.value = response.data?.data?.farms
        kins.value = response.data?.data?.kins
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

const openMapDialog = _latlong => {
  mapDialong.value = true
  latlong = _latlong
}

const openEditFarmerDetailsModal = () => {
  farmerDialog.value = true
}

const addFarmDialog = () => {
  farmDialog.value = true
}

const addKinDialog = () => {
  kinDialog.value = true
}

// tabs
const tabs = [
  {
    title: 'Farms(units)',
    icon: 'bx-map',
    tab: 'farm',
  },
  {
    title: 'Next Of Kin',
    icon: 'bx-user',
    tab: 'kin',
  },
  {
    title: 'Loans',
    icon: 'bx-money',
    tab: 'loan',
  },
  {
    title: 'Security',
    icon: 'bx-lock-open',
    tab: 'security',
  },
]


</script>

<template>
  <VRow>
    <VCol md="4">
      <VSkeletonLoader
        v-if="farmer.length === 0"
        class="mx-auto"
        elevation="12"
        max-width="500"
        type="table-heading, list-item-two-line, image, table-tfoot"
      />

      <VCard v-else>
        <VCardItem>
          <VCardText class="text-center pt-12">
            <VAvatar
              class="v-avatar v-theme--light v-avatar--density-default v-avatar--rounded v-avatar--variant-flat"
              style="block-size: 120px; inline-size: 120px"
            >
              <div class="v-responsive v-img">
                <img
                  class="v-img__img v-img__img--cover"
                  src="@images/avatars/avatar-1.png"
                >
              </div>
            </VAvatar>
            <h5 class="text-h5 mt-4">
              {{
                `${farmer?.first_name}`
                  + " "
                  + `${farmer?.middle_name}`
                  + " "
                  + `${farmer?.last_name}`
              }}
            </h5>

            <VChip class="mt-4">
              Farmer
            </VChip>
            <VRow class="mt-4">
              <VCol>
                <div class="d-flex align-center me-8">
                  <VAvatar
                    class="mr-2 v-avatar v-theme--light v-avatar--density-default v-avatar--rounded v-avatar--variant-flat"
                    size="large"
                    style="
                      background-color: #ece9fc;
                      block-size: 40px;
                      color: #2a1261;
                      inline-size: 40px;
                    "
                  >
                    <VIcon icon="bx-check" />
                    <span class="v-avatar__underlay" />
                  </VAvatar>
                  <div>
                    <h5 class="text-h5">
                      {{ farmer?.farms_count }}
                    </h5>
                    <span class="text-body-1 d-inline-block">Farms</span>
                  </div>
                </div>
              </VCol>
              <VCol>
                <div class="d-flex align-center me-8">
                  <VAvatar
                    class="mr-2 v-avatar v-theme--light v-avatar--density-default v-avatar--rounded v-avatar--variant-flat"
                    size="large"
                    style="
                      background-color: #ece9fc;
                      block-size: 40px;
                      color: #2a1261;
                      inline-size: 40px;
                    "
                  >
                    <VIcon icon="bx-money" />
                    <span class="v-avatar__underlay" />
                  </VAvatar>
                  <div>
                    <h5 class="text-h5">
                      {{ farmer?.loans_sum_total }}
                    </h5>
                    <span class="text-body-1 d-inline-block">Loans</span>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
          <h5 class="text-h5 mb-4">
            Details
          </h5>
          <VDivider />
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Names: </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>
                {{
                  `${farmer?.first_name}`
                    + " "
                    + `${farmer?.middle_name}`
                    + " "
                    + `${farmer?.last_name}`
                }}
              </VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>Phone Number: </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ farmer?.phone_number }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VRow class="mt-1">
            <VCol>
              <VCardTitle>ID/Passport: </VCardTitle>
            </VCol>
            <VCol>
              <VCardSubtitle>{{ farmer?.registration_number }}</VCardSubtitle>
            </VCol>
          </VRow>
          <VCardItem class="justify-center">
            <VBtn
              class="my-4 mx-2"
              variant="tonal"
              color="primary"
              @click="openEditFarmerDetailsModal"
            >
              Edit
            </VBtn>

            <VBtn
              class="my-4 mx-2"
              variant="tonal"
              color="error"
            >
              Suspend
            </VBtn>
          </VCardItem>
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
          <!-- Farms -->
          <VWindowItem value="farm">
            <VCard>
              <VCardItem>
                <VCardTitle>Farms</VCardTitle>
                <template #append>
                  <VBtn
                    size="small"
                    prepend-icon="bx bx-plus"
                    @click="addFarmDialog"
                  >
                    Add Farm
                  </VBtn>
                </template>
              </VCardItem>
            </VCard>
            <VTable class="text-no-wrap">
              <thead>
                <tr>
                  <th>Ownership</th>
                  <th>Size</th>
                  <th>Terrain</th>
                  <th>Location</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in farms"
                  :key="item.id"
                >
                  <td>
                    {{ item.ownership }}
                  </td>
                  <td>
                    {{ item.size }}
                  </td>
                  <td>
                    {{ item.terrain }}
                  </td>
                  <td>
                    <VChip>{{ item?.location }}</VChip>
                    <VBtn
                      class="mx-2"
                      size="small"
                      icon="bx-map"
                      variant="outlined"
                      color="success"
                      @click="
                        openMapDialog({
                          lat: parseFloat(item?.latitude, 10),
                          lng: parseFloat(item?.longitude, 10),
                        })
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>
          <!-- Kin -->
          <VWindowItem value="kin">
            <VCard>
              <VCardItem>
                <VCardTitle>Kins</VCardTitle>
                <template #append>
                  <VBtn
                    size="small"
                    prepend-icon="bx bx-plus"
                    @click="addKinDialog"
                  >
                    Add Next Of Kin
                  </VBtn>
                </template>
              </VCardItem>
            </VCard>
            <VTable class="text-no-wrap">
              <thead>
                <tr>
                  <th>Names</th>
                  <th>Contact</th>
                  <th>County</th>
                  <th>Sub County</th>
                  <th>Ward</th>
                  <th>Relationship</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in kins"
                  :key="item.id"
                >
                  <td>{{ item?.name }}</td>
                  <td>{{ item?.phone_number }}</td>
                  <td>{{ item?.administration_level_one?.name }}</td>
                  <td>{{ item?.administration_level_two?.name }}</td>
                  <td>{{ item?.administration_level_three?.name }}</td>
                  <td>{{ item?.relationship?.name }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>
          <!-- Loans -->
          <VWindowItem value="loan">
            <VTable class="text-no-wrap">
              <thead>
                <tr>
                  <th>Date Issued</th>
                  <th>Principle Amount(KEs)</th>
                  <th>Amount Payable</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in farms"
                  :key="item.id"
                >
                  <td>19/08/2024</td>
                  <td>40,000.00</td>
                  <td>44,000.00</td>
                  <td>56days</td>
                  <td>Paid</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>
          <!-- Security -->
          <VWindowItem value="security">
            <VCard>
              <VCardItem class="pb-3">
                <Password />
              </VCardItem>
            </VCard>
          </VWindowItem>
        </VWindow>
      </div>
    </VCol>
  </VRow>
  <EditFarmerDetailsModal
    :dialog="farmerDialog"
    :farmer="farmer"
    @update:dialog="farmerDialog = $event"
    @refresh-farmer="fetchFarmer"
  />
  <AddFarmModal
    :dialog="farmDialog"
    :farmer="farmer"
    @update:dialog="farmDialog = $event"
    @refresh-farmer="fetchFarmer"
  />
  <ViewFarmLocationModal
    :dialog="mapDialong"
    :latlong="latlong"
    @update:dialog="mapDialong = $event"
  />
  <AddKinModal
    :dialog="kinDialog"
    :farmer="farmer"
    @update:dialog="kinDialog = $event"
    @refresh-farmer="fetchFarmer"
  />
</template>
