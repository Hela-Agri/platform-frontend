<script setup lang="ts">
import { getFarmers, removeFarmer } from "@/api/farmer";
import ListFilter from "@/pages/filter/ListFilter.vue";
import { formatDate, hasPermission } from "@/utils";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import FarmerYieldReportModal from "@/pages/modals/ReportModal.vue";
import FarmerLoanReportModal from "@/pages/modals/farmerLoanReportModal.vue";
import ViewDepositModal from "@/pages/modals/viewDepositModal.vue";
import ApproveFarmActivityModal from "@/pages/modals/approveFarmActivityModal.vue";

interface Filter {
  [key: string]: any;
}

const yieldDialog = ref<boolean>(false)
const loanDialog = ref<boolean>(false)
const title = ref('')
const farmer = ref([]);
const farmers = ref([]);
const per_page = ref(0);
const current_page = ref(1);
const pages = ref(0);
const total = ref(0);
let entity_params: Filter = {};
let form_filter_params: Filter = {};
const isLoading = ref<boolean>(false);
const form = ref({
  name: "",
  description: "",
});

const headers = [
  { title: "FIRST NAME", key: "first_name" },
  { title: "MIDDLE NAME", key: "middle_name" },
  { title: "LAST NAME", key: "last_name" },
  { title: "PHONE", key: "phone_number" },
  { title: "EMAIL", key: "email" },
  { title: "CREATED", key: "created_at" },
  { title: "REG NO", key: "registration_number" },
  { title: "ACTION", key: "action" },
];

const fetchData = async (): Promise<void> => {
  isLoading.value = true;
  try {
    // eslint-disable-next-line camelcase
    entity_params = {
      ...form_filter_params,
      ...{ page: current_page.value, orderBy: "created_at", sortedBy: "desc" },
    };
    getFarmers(entity_params).then((response) => {
      if (response.data.success) {
        farmers.value = response.data.data?.data;
        pages.value = Math.ceil(response.data.data?.total / response.data.data?.per_page);
        total.value = response.data.data?.total;
        per_page.value = response.data.data?.per_page;
      } else {
        console.log(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const  loanReport = item => {
  title.value = `${item.first_name} ${item.middle_name} LOAN REPORT`
  loanDialog.value = true
  farmer.value = item
}


const deleteFarmer = async (uuid) => {
  try {
    removeFarmer(uuid).then((response) => {
      if (response.data.success) toast.success(response.data.message);
      else console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchData();
});

interface Farmer {
  name: string;
  created_at: number;
}

const formattedFarmers = computed<Farmer[]>(() => {
  return farmers.value.map((farmer) => ({
    ...farmer,
    created_at: formatDate(farmer.created_at),
  }));
});

const filterList = (filterForm) => {
  // eslint-disable-next-line camelcase
  form_filter_params = filterForm;
  current_page.value = 1
  fetchData();
};
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Farmers List</VCardTitle>
      <template #append>
        <ListFilter
          :filter_farmer="false"
          filter_cohort
          :filter_offtaker="false"
          filter_first_name
          filter_middle_name
          filter_last_name
          filter_phone_number
          filter_email
          filter_center
          :filter_system_user="false"
          :filter_date="false"
          title="Filter Farmers List"
          @on-filter="filterList"
         />
        <VCol cols="auto">
          <VBtn
            v-if="hasPermission('create.farmer')"
            size="small"
            prepend-icon="bx bx-plus"
            href="/form/farmer/wizard"
          >
            Add Farmer
          </VBtn>
        </VCol>
      </template>
    </VCardItem>
  </VCard>
  <VDataTable
    v-if="hasPermission('list.farmer')"
    :headers="headers"
    :items="formattedFarmers"
    :items-per-page="per_page"
    height="500"
    fixed-header
  >
    <template #bottom>
      <VRow class="justify-center">
        <VPagination
          v-model="current_page"
          class="my-4"
          :length="pages"
          :total-visible="5"
          @first="fetchData"
          @last="current_page = pages"
          @update:model-value="fetchData"
        />
        <VChip class="my-5 mx-5"> Total: {{ total }} </VChip>
      </VRow>
    </template>
    <!-- actions -->
    <template #item.action="{ item }">
      <VMenu>
        <template #activator="{ props }">
          <VBtn v-bind="props" variant="tonal" icon="bx bx-dots-vertical-rounded" />
        </template>
        <VList>
          <VListItem
            v-if="hasPermission('view.farmer')"
            :href="`/view/farmer/${item.id}`"
          >
            <IconBtn> <VIcon icon="bx bx-check-circle" /> </IconBtn>Manage
          </VListItem>
          <VListItem
            @click="loanReport(item)"
          >
            <IconBtn> <VIcon icon="bx bxl-deezer"/> </IconBtn
            ><span>Loan Report</span>
          </VListItem>
          <VListItem
            v-if="hasPermission('delete.farmer')"
            @click="deleteFarmer(`${item.id}`)"
          >
            <IconBtn> <VIcon icon="bx bx-trash" class="text-error" /> </IconBtn
            ><span class="text-error">Delete</span>
          </VListItem>
        </VList>
      </VMenu>
    </template>
  </VDataTable>
  <FarmerLoanReportModal
    :dialog="loanDialog"
    :farmer="farmer"
    description="Select Date Range"
    :title="title"
    activities=""
    multiple
    @update:dialog="loanDialog = $event"
    @refresh-farmer="fetchData"
  />
</template>
