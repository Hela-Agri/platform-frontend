<script lang="ts" setup>
import { addSiteVisit, getActions } from "@/api/shared";
import ImagePicker from "@/components/ImagePicker.vue";
import { defineEmits, defineProps, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { VTextarea } from "vuetify/components";

const props = defineProps<{
  dialog: boolean;
  farm_activity_id: string;
}>();

const emit = defineEmits<{
  (e: "update:site_visit_dialog", value: boolean): void;
  (e: "refresh-farmer"): void;
}>();

// Function to close the dialog
const closeDialog = () => {
  emit("update:site_visit_dialog", false);
};

const urgency = [
  { name: "Critical", value: "critical" },
  { name: "High", value: "high" },
  { name: "Medium", value: "medium" },
  { name: "Low", value: "low" },
];
const actions = ref();
let files: File[] = [];
const loading = ref(false);
const refSiteVisitForm = ref();
let siteVisitForm = ref({
  farm_activity_id: "",
  action_id: "",
  remarks: "",
  urgency: "",
  latitude: 0,
  longitude: 0,
});

onMounted(async () => {
  await getActionList();
  getLocation();
});

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          siteVisitForm.value.latitude = position.coords.latitude;
          siteVisitForm.value.longitude = position.coords.longitude;
        } else {
          toast.error(`There was an error retrieving your current location`);
          emit("update:site_visit_dialog", false);
        }
      },
      (err) => {
        toast.error(`Error: ${err.message}`);
        emit("update:site_visit_dialog", false);
      }
    );
  } else {
    toast.error("Geolocation is not supported by this browser.");
    emit("update:site_visit_dialog", false);
  }
};

const getActionList = async () => {
  try {
    getActions({}).then(
      (response: { data: { success: any; data: { data: never[] } } }) => {
        if (response.data.success) {
          actions.value = response.data?.data;
        } else {
          console.log(response);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const validateSiteVisitForm = () => {
  (siteVisitForm.value.farm_activity_id = props.farm_activity_id),
    refSiteVisitForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        submitData();
      } else {
      }
    });
};

const submitData = () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append(`farm_activity_id`, siteVisitForm.value.farm_activity_id);
    formData.append(`action_id`, siteVisitForm.value.action_id);
    formData.append(`remarks`, siteVisitForm.value.remarks);
    formData.append(`urgency`, siteVisitForm.value.urgency);
    formData.append(`latitude`, `${siteVisitForm.value.latitude}`);
    formData.append(`longitude`, `${siteVisitForm.value.longitude}`);
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    addSiteVisit(formData).then(async (response) => {
      if (response.status == 200) {
        loading.value = false;
        toast.success(response.data.message);
        files = [];
        siteVisitForm.value = {
          farm_activity_id: "",
          action_id: "",
          remarks: "",
          urgency: "",
          latitude: 0,
          longitude: 0,
        };
        emit("update:site_visit_dialog", false);
      } else {
        loading.value = false;
        toast.error(response.data.message);
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const requiredRule = ref<Array<(value: string) => boolean | string>>([
  (value) => {
    if (value) return true;

    return "Field is required.";
  },
]);
const requiredFile = ref<Array<(value: string) => boolean | string>>([
  (value) => {
    if (value.length == 0) {
      return "Image is required.";
    } else {
      return true;
    }
  },
]);
const processFile = (file: File) => {
  try {
    files.push(file);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="pa-4 text-center">
    <VDialog v-model="props.dialog" max-width="80%">
      <VCard prepend-icon="bx bx-plus" title="Add Farm Visit">
        <VCardText>
          <VForm ref="refSiteVisitForm" @submit.prevent="validateSiteVisitForm">
            <VRow class="my-2">
              <!-- 👉 Description -->
              <VCol cols="12" md="6">
                <VSelect
                  width="100%"
                  validate-on="submit"
                  :rules="requiredRule"
                  v-model="siteVisitForm.action_id"
                  max-width="100%"
                  clearable
                  label="Select action to be taken"
                  :items="actions"
                  item-title="name"
                  item-value="id"
                />
              </VCol>
              <!-- 👉 Description -->
              <VCol cols="12" md="6">
                <VSelect
                  width="100%"
                  validate-on="submit"
                  :rules="requiredRule"
                  v-model="siteVisitForm.urgency"
                  max-width="100%"
                  clearable
                  label="Indicate the urgency level"
                  :items="urgency"
                  item-title="name"
                  item-value="value"
                />
              </VCol>
              <!-- 👉 remarks -->
              <VCol cols="12" md="12">
                <VTextarea
                  label="Remarks"
                  v-model="siteVisitForm.remarks"
                  placeholder="Add your remarks"
                  validate-on="submit"
                  :rules="requiredRule"
                />
              </VCol>
              <VCol cols="12" md="6">
                <ImagePicker
                  image_label="Select First Image"
                  :requiredValidator="requiredFile"
                  placeholder="Select First Image"
                  @select:image="processFile"
                ></ImagePicker
              ></VCol>
              <VCol cols="12" md="6">
                <ImagePicker
                  image_label="Select Second Image"
                  :requiredValidator="requiredFile"
                  placeholder="Select Second Image"
                  @select:image="processFile"
                ></ImagePicker
              ></VCol>
            </VRow>

            <VDivider />
            <VCardActions class="mt-2">
              <VSpacer />
              <VSpacer />
              <VBtn :loading="loading" type="submit">
                Submit
                <VIcon icon="bx-save" end class="flip-in-rtl" />
              </VBtn>
              <VBtn text="Close" color="red" @click="closeDialog" />
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
