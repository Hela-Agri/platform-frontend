<script lang="ts" setup>
import { updateFarmerActivity } from "@/api/farmer";
import { getUnits } from "@/api/shared";
import LocationPickerModal from "@/pages/modals/LocationPickerModal.vue";
import { formattedErrors } from "@/utils";
import { defineEmits, defineProps, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";

const props = defineProps<{
  dialog: boolean;
  farmer: object;
}>();

const emit = defineEmits<{
  (e: "update:dialog", value: boolean): void;
  (e: "refresh-farmer"): void;
}>();

// Function to close the dialog
const closeDialog = () => {
  emit("update:dialog", false);
};

const requiredValidator = ref([
  (value: any) => {
    if (value) return true;

    return "Field is required.";
  },
]);

const units = ref([]);
const isLoading = ref(false);
const currentFarmForm = ref(0);
const showMapPicker = ref(false);
interface FarmForm {
  id: string;
  ownership: string;
  unit_id: ReturnType<typeof ref>;
  size: string;
  terrain: string;
  latitude: "";
  longitude: "";
  location: "";
  units: any[];
}

const farmFormList = ref<FarmForm[]>([]);

const generateFarmForm = async () => {
  const farmForm: FarmForm = {
    id: "",
    ownership: "",
    size: "",
    unit_id: ref(),
    terrain: "",
    latitude: "",
    longitude: "",
    location: "",
    units: units.value,
  };

  farmFormList.value.push(farmForm);
};

function addFarmRow() {
  generateFarmForm();
}

onMounted(async () => {
  await getUnitList();
});

function toogleShowMapPicker(idx: any) {
  currentFarmForm.value = idx;
  showMapPicker.value = !showMapPicker.value;
}

function setLocation(payloadList: Array<any>) {
  const payload = payloadList[0];

  farmFormList.value[currentFarmForm.value].location = payload.formatted_address;
  farmFormList.value[currentFarmForm.value].latitude = payload.geometry.location.lat;
  farmFormList.value[currentFarmForm.value].longitude = payload.geometry.location.lng;
  payload.geometry.location.longitude;
}

const getUnitList = async () => {
  try {
    getUnits({ classification: 'farm' }).then((response) => {
      if (response.data.success) {
        units.value = response.data?.data?.data;
        generateFarmForm();
      } else {
        console.log(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const FarmItemsPayload = () => {
  const items: {
    item_type: string;
    price: string;
    quantity: unknown;
    item_id: unknown;
    total: unknown;
  }[] = [];

  farmFormList.value.forEach((element) => {
    items.push({
      item_type: element.item_type,
      price: element.price,
      quantity: element.quantity,
      item_id: element.item_id,
      total: element.total,
    });
  });

  return items;
};

const submitData = () => {
  try {
    const payload = {
      farm_activity_items: FarmItemsPayload(),
    };

    updateFarmerActivity(props.farmer.id, payload).then(async (response) => {
      if (response.status === 200) {
        toast.success(response.data.message);
        closeDialog();
        // eslint-disable-next-line vue/custom-event-name-casing
        emit("refresh-farmer");
      } else {
        toast.error(formattedErrors(response.data.errors));
        closeDialog();
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="pa-4 text-center">
    <VDialog v-model="props.dialog" max-width="1600">
      <VCard prepend-icon="bx bx-plus" title="Add Farm(s)">
        <VCardText>
          <VForm @submit.prevent="submitData">
            <VRow>
              <VCol cols="12" md="12">
                <VTable>
                  <thead>
                    <tr>
                      <th class="text-left">Ownership</th>
                      <th class="text-left">Terrain</th>
                      <th class="text-left">Location</th>
                      <th class="text-left">Land Size</th>
                      <th class="text-left">Unit of measure</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(farmForm, index) in farmFormList" :key="index">
                      <td>
                        <VSelect
                          v-model="farmForm.ownership"
                          max-width="200px"
                          clearable
                          label="Select"
                          :items="[
                            { name: 'Owned', value: 'owned' },
                            { name: 'Leased', value: 'leased' },
                            { name: 'Family Land', value: 'family_land' },
                          ]"
                          item-title="name"
                          item-value="value"
                        />
                      </td>
                      <td>
                        <VSelect
                          v-model="farmForm.terrain"
                          max-width="200px"
                          clearable
                          label="Select"
                          :items="[
                            { name: 'Flat', value: 'flat' },
                            { name: 'Slope', value: 'slope' },
                          ]"
                          item-title="name"
                          item-value="value"
                        />
                      </td>
                      <td>
                        <VRow min-width="250px">
                          <VTextField
                            v-model="farmForm.location"
                            min-width="200px"
                            label="Farm Location"
                            type="text"
                            readonly
                          />

                          <VIcon
                            icon="bx bx-map-pin"
                            size="24"
                            class="mx-2 my-2"
                            color="primary"
                            @click="toogleShowMapPicker(index)"
                          />
                        </VRow>
                      </td>
                      <td>
                        <VTextField
                          v-model="farmForm.size"
                          min-width="200px"
                          label="Size"
                          type="number"
                          clearable
                        />
                      </td>

                      <td>
                        <VSelect
                          v-model="farmForm.unit_id"
                          min-width="120px"
                          placeholder="Acre"
                          :items="farmForm.units"
                          item-title="name"
                          item-value="id"
                          validate-on="submit"
                          :rules="requiredValidator"
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="8" class="text-right">
                        <VBtn type="button" variant="outlined" @click="addFarmRow">
                          Add Row
                          <VIcon icon="bx-plus" end class="flip-in-rtl" />
                        </VBtn>
                      </td>
                    </tr>
                  </tfoot>
                </VTable>
              </VCol>
            </VRow>
            <VDivider />
            <VCardActions>
              <VSpacer />
              <VSpacer />
              <VBtn text="Close" color="red" @click="closeDialog" />
              <VBtn type="submit">
                Submit
                <VIcon icon="bx-save" end class="flip-in-rtl" />
              </VBtn>
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
  <LocationPickerModal :dialog="showMapPicker" @set-location="setLocation" />
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
