<script setup lang="ts">
import {addSiteVisit} from "@/api/shared";

const file = ref();
const refUploadForm = ref();
import {defineEmits, defineProps, ref} from "vue";
import {toast} from "vue3-toastify";
import {uploadProductList} from "@/api/product";

const requiredFile = ref<Array<(value: string) => boolean | string>>([
  (value) => {
    if (value.length == 0) {
      return "Upload File is required.";
    } else {
      return true;
    }
  },
]);
const loading = ref(false);
const onFileSelected = (event: { target: { files: any[] } }) => {
   file.value = event.target.files[0];

};
const props = defineProps<{
  dialog: boolean;
}>();

const emit = defineEmits<{
  (e: "update:product_upload_dialog", value: boolean): void;
  (e: "refresh-products"): void;
}>();

// Function to close the dialog
const closeDialog = () => {
  emit("update:product_upload_dialog", false);
};
const validateUploadForm = () => {
  refUploadForm.value?.validate().then((valid: any) => {
      if (valid.valid) {

          loading.value = true;
          try {
            const formData = new FormData();
            formData.append(`product_list`, file.value);
            uploadProductList(formData).then(async (response) => {
              if (response.status == 200) {
                loading.value = false;
                toast.success(response.data.message);

                emit("update:product_upload_dialog", false);
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


      } else {
      }
    });
};

</script>

<template>
  <VDialog v-model="props.dialog" max-width="50%">
    <VForm ref="refUploadForm" @submit.prevent="validateUploadForm">
    <VCard>
      <VCardTitle>Upload Products</VCardTitle>
      <VCardItem>


          <VRow class="ma-2">
        <VFileInput
          :rules="requiredFile"
          accept=".csv, .xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Add Product List File"
          placeholder="Add Product List File"
          prepend-icon="bx bx-upload"
          @input="onFileSelected"
        ></VFileInput>
          </VRow>


      </VCardItem>
      <VDivider />
      <VCardActions class="mt-2">
        <VSpacer />
        <VSpacer />
        <VBtn :loading="loading" type="submit">
          Upload
          <VIcon icon="bx-upload" end class="flip-in-rtl" />
        </VBtn>
        <VBtn text="Close" color="red" @click="closeDialog" />
      </VCardActions>
    </VCard>
    </VForm>
  </VDialog>

</template>

<style scoped>

</style>
