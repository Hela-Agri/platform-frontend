<script setup lang="ts">
 import {ref} from "vue";
 import { QuillEditor } from '@vueup/vue-quill'
 import '@vueup/vue-quill/dist/vue-quill.snow.css';
 import {addSettings, getSettings, updateSettings} from "@/api/setting";
 import {router} from "@/plugins/router";
 import {toast} from "vue3-toastify";
 import ImagePicker from "@/components/ImagePicker.vue";

 const loading = ref<boolean>(false)
 const settings= ref([])
 const fetchSettings = async () => {
   loading.value = true
   try {
     getSettings().then(response => {
       if (response?.data?.success) {
         settings.value=response?.data?.data;

       }
       else { console.log(response) }
     })
   }
   catch (error) {
     console.log(error)
   }
   finally {
     loading.value = false
   }
 }
 onMounted(async () => {
   await fetchSettings();
})

</script>

<template>

  <VCard>
    <VCardTitle>General</VCardTitle>
    <VCardItem>
      <VRow class="mt-5 ps-5">
        <VCol cols="6" md="6" v-if="settings?.uploads?.[0]?.id">
          <img :src="settings.uploads?.[0]?.path" alt="logo" style="width:200px;"/>
        </VCol>

      </VRow>
      <VRow>
        <VCol cols="6" md="6">
          <div class="d-flex flex-row mb-6">
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2">Name</v-sheet>
              <v-sheet class="ma-2 pa-2">Phone</v-sheet>
              <v-sheet class="ma-2 pa-2">Email</v-sheet>
            </div>
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2"><b>{{settings?.name}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>{{settings?.phone}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>{{settings.email}}</b></v-sheet>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="6">
          <div class="d-flex flex-row mb-6">
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2">KRA PIN</v-sheet>
              <v-sheet class="ma-2 pa-2">Address</v-sheet>
              <v-sheet class="ma-2 pa-2">Slogan</v-sheet>
            </div>
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2"><b>{{settings.kra_pin}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>{{settings.address}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>{{settings.slogan}}</b></v-sheet>
            </div>
          </div>
        </VCol>

      </VRow>

    </VCardItem>
  </VCard>
  <VCard class="mt-5">
    <VCardTitle>Accounting</VCardTitle>
    <VCardItem>
      <VRow class="mt-1">
        <VCol>
          <v-sheet class="ma-2 pa-2"><b>Invoice Notes</b></v-sheet>
          <span v-html="settings?.invoice_note"></span>

        </VCol>
        <VCol>
          <v-sheet class="ma-2 pa-2"><b>Payment Notes</b></v-sheet>
          <span v-html="settings?.payment_note"></span>
        </VCol>
      </VRow>

    </VCardItem>
    <VCardItem>
      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn
          type="button"
          href="/account-settings/edit"
          color="info"
          prepend-icon="bx bx-pencil"
          variant="flat"
        >
          Edit
        </VBtn>

      </VCol>
    </VCardItem>
  </VCard>
</template>

<style scoped>

</style>
