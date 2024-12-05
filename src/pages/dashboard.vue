<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getStatistics } from '@/api/report'

interface Filter {
  [key: string]: any
}
const isLoading = ref<boolean>(false)
const statistics = ref<[]>([])

const fetchData = async (filter?: Filter, page?: number): Promise<void> => {
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
    await getStatistics(entity_params, page ?? 1).then((response:any)=>{
      if (response.status === 200) {
        isLoading.value = false

        statistics.value = response.data.data;
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
  fetchData()
})
</script>

<template>
  <VRow>
    <VCol cols="12" md="3">
      <VCard class="logistics-card-statistics-info">

        <VCardText>
          <div class="d-flex align-center gap-x-4 mb-2">
            <div class="v-avatar v-theme--light text-info v-avatar--density-default v-avatar--rounded v-avatar--variant-tonal" style="width: 40px; height: 40px;">
              <i class="bx-user v-icon " aria-hidden="true" style="font-size: 24px; height: 24px; width: 24px;"></i>
              <span class="v-avatar__underlay"></span>
            </div>
            <h4 class="text-h4">{{statistics.total_farmers}}</h4></div>
          <div class="text-body-1 mb-2">Farmers</div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3">
      <VCard class="logistics-card-statistics-primary">

        <VCardText>
          <div class="d-flex align-center gap-x-4 mb-2">
            <div class="v-avatar v-theme--light text-primary v-avatar--density-default v-avatar--rounded v-avatar--variant-tonal" style="width: 40px; height: 40px;">
              <i class="bx bx-shape-square v-icon " aria-hidden="true" style="font-size: 24px; height: 24px; width: 24px;"></i>
              <span class="v-avatar__underlay"></span>
            </div>

            <h4 class="text-h4">{{statistics.total_farms}}</h4></div>
          <div class="text-body-1 mb-2">Farms</div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3">
      <VCard class="logistics-card-statistics-error">

        <VCardText>
          <div class="d-flex align-center gap-x-4 mb-2">
            <div class="v-avatar v-theme--light text-error v-avatar--density-default v-avatar--rounded v-avatar--variant-tonal" style="width: 40px; height: 40px;">
              <i class="bx bx-calculator v-icon " aria-hidden="true" style="font-size: 24px; height: 24px; width: 24px;"></i>
              <span class="v-avatar__underlay"></span>
            </div>
            <h4 class="text-h4">{{statistics.average_acres}}</h4></div>
          <div class="text-body-1 mb-2">Average Arceage</div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3">
      <VCard class="logistics-card-statistics-maroon">

        <VCardText>
          <div class="d-flex align-center gap-x-4 mb-2">
            <div class="v-avatar v-theme--light text-maroon v-avatar--density-default v-avatar--rounded v-avatar--variant-tonal" style="width: 40px; height: 40px;">
              <i class="bx bx-trending-up v-icon " aria-hidden="true" style="font-size: 24px; height: 24px; width: 24px;"></i>
              <span class="v-avatar__underlay"></span>

            </div>
            <h4 class="text-h4">{{statistics.farm_input_total}}</h4></div>
          <div class="text-body-1 mb-2">Input Total(KES)</div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3">
      <VCard class="logistics-card-statistics-purple">

        <VCardText>
          <div class="d-flex align-center gap-x-4 mb-2">
            <div class="v-avatar v-theme--light text-purple v-avatar--density-default v-avatar--rounded v-avatar--variant-tonal" style="width: 40px; height: 40px;">
              <i class="bx bx-trending-up v-icon " aria-hidden="true" style="font-size: 24px; height: 24px; width: 24px;"></i>
              <span class="v-avatar__underlay"></span>

            </div>
            <h4 class="text-h4">{{statistics.average_farm_input}}</h4></div>
          <div class="text-body-1 mb-2">Input Per Farmer</div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="3">
      <VCard class="logistics-card-statistics-warning">

        <VCardText>
          <div class="d-flex align-center gap-x-4 mb-2">
            <div class="v-avatar v-theme--light text-warning v-avatar--density-default v-avatar--rounded v-avatar--variant-tonal" style="width: 40px; height: 40px;">
              <i class="bx bx-trending-up v-icon " aria-hidden="true" style="font-size: 24px; height: 24px; width: 24px;"></i>
              <span class="v-avatar__underlay"></span>

            </div>
            <h4 class="text-h4">--</h4></div>
          <div class="text-body-1 mb-2">Income Per Farmer</div>
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
</template>
<style scoped>
.logistics-card-statistics-info {
  border-block-end-color: rgba(var(--v-theme-info), 0.58); /* Initial opacity: 38% */
  border-block-end-width: 2px; /* Initial width */
  border-block-end-style: solid; /* Solid border */
  transition: border-block-end-color 0.3s ease, border-block-end-width 0.3s ease; /* Smooth transition */
}

.logistics-card-statistics-info:hover {
  border-block-end-color: rgba(var(--v-theme-info));
  border-block-end-width: 5px;
}
.logistics-card-statistics-primary {
  border-block-end-color: rgba(var(--v-theme-primary), 0.58); /* Initial opacity: 38% */
  border-block-end-width: 2px; /* Initial width */
  border-block-end-style: solid; /* Solid border */
  transition: border-block-end-color 0.3s ease, border-block-end-width 0.3s ease; /* Smooth transition */
}

.logistics-card-statistics-primary:hover {
  border-block-end-color: rgba(var(--v-theme-primary));
  border-block-end-width: 5px;
}

.logistics-card-statistics-error {
  border-block-end-color: rgba(var(--v-theme-error), 0.58); /* Initial opacity: 38% */
  border-block-end-width: 2px; /* Initial width */
  border-block-end-style: solid; /* Solid border */
  transition: border-block-end-color 0.3s ease, border-block-end-width 0.3s ease; /* Smooth transition */
}

.logistics-card-statistics-error:hover {
  border-block-end-color: rgba(var(--v-theme-error));
  border-block-end-width: 5px;
}
.logistics-card-statistics-warning {
  border-block-end-color: rgba(var(--v-theme-warning), 0.58); /* Initial opacity: 38% */
  border-block-end-width: 2px; /* Initial width */
  border-block-end-style: solid; /* Solid border */
  transition: border-block-end-color 0.3s ease, border-block-end-width 0.3s ease; /* Smooth transition */
}

.logistics-card-statistics-warning:hover {
  border-block-end-color: rgba(var(--v-theme-warning));
  border-block-end-width: 5px;
}

.logistics-card-statistics-purple {
  border-block-end-color: rgba(102, 51, 153, 0.58); /* Initial opacity: 38% */
  border-block-end-width: 2px; /* Initial width */
  border-block-end-style: solid; /* Solid border */
  transition: border-block-end-color 0.3s ease, border-block-end-width 0.3s ease; /* Smooth transition */
}

.logistics-card-statistics-purple:hover {
  border-block-end-color: rgba(102, 51, 153);
  border-block-end-width: 5px;
}
.text-purple {
  color: rgb(102, 51, 153) !important;
}

.logistics-card-statistics-maroon {
  border-block-end-color: rgba(128,0,0, 0.58); /* Initial opacity: 38% */
  border-block-end-width: 2px; /* Initial width */
  border-block-end-style: solid; /* Solid border */
  transition: border-block-end-color 0.3s ease, border-block-end-width 0.3s ease; /* Smooth transition */
}

.logistics-card-statistics-maroon:hover {
  border-block-end-color: rgba(128,0,0);
  border-block-end-width: 5px;
}
.text-maroon {
  color: rgb(128,0,0) !important;
}
</style>
