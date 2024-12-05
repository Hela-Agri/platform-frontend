<script setup lang="ts">
 import {ref} from "vue";
 import { QuillEditor } from '@vueup/vue-quill'
 import '@vueup/vue-quill/dist/vue-quill.snow.css';
 import {addSettings, getSettings, updateSettings} from "@/api/setting";
 import {router} from "@/plugins/router";
 import {toast} from "vue3-toastify";
 import ImagePicker from "@/components/ImagePicker.vue";
 const settingsForm = ref({
   id: '',
   name: '',
   email: '',
   phone: '',
   address: '',
   slogan: '',
   kra_pin: '',
   invoice_note: '',
   payment_note: '',
   logo_file: {}
 })
 const formData = new FormData();
 const loading = ref<boolean>(false)
 const route = useRoute()
 const refSettingForm = ref()
 const fetchSettings = async () => {
   loading.value = true
   try {
     getSettings().then(response => {
       if (response?.data?.success) {
         settingsForm.value.id=response?.data?.data?.id;
         settingsForm.value.name=response?.data?.data?.name;
         settingsForm.value.email=response?.data?.data?.email;
         settingsForm.value.phone=response?.data?.data?.phone;
         settingsForm.value.address=response?.data?.data?.address;
         settingsForm.value.slogan=response?.data?.data?.slogan;
         settingsForm.value.kra_pin=response?.data?.data?.kra_pin;
         settingsForm.value.invoice_note=response?.data?.data?.invoice_note;
         settingsForm.value.payment_note=response?.data?.data?.payment_note;
         settingsForm.value.logo_file=response?.data?.data?.uploads[0]??{};
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
 const submitForm = async () => {
   refSettingForm.value?.validate().then(async (valid: any) => {
     if (valid.valid) {
       try {

         formData.set(`name`, settingsForm.value.name);
         formData.set(`email`, settingsForm.value.email);
         formData.set(`phone`, settingsForm.value.phone);
         formData.set(`address`, settingsForm.value.address);
         formData.set(`slogan`, settingsForm.value.slogan);
         formData.set(`kra_pin`, settingsForm.value.kra_pin);
         formData.set(`invoice_note`, settingsForm.value.invoice_note);
         formData.set(`payment_note`, settingsForm.value.payment_note);

         if (settingsForm.value.id) {

           await updateSettings(settingsForm.value.id, formData).then(async response => {
             loading.value = false
             await router.replace('/account-settings')
             toast.success(response.data.message)

           })

         } else {
           await addSettings(formData).then(async response => {
             loading.value = false
             await router.replace('/account-settings')
             toast.success(response.data.message)

           })
         }
       } catch (error: any) {
         toast.success(error?.data?.message)
         console.log(error)
       }
     }
   });
 }

 const requiredRule = ref<Array<(value: string) => boolean | string>>([
   value => value ? true : 'Field is required.',
 ])
 const requiredFile = ref<Array<(value: string) => boolean | string>>([
   (value) => {
     if (value.length == 0 && !settingsForm.value.logo_file?.id) {
       return "Image is required.";
     } else {
       return true;
     }
   },
 ]);
 const processLogoFile = (file: File) => {
   try {
     formData.set(`logo_file`, file);
   } catch (error) {
     console.log(error);
   } finally {
     loading.value = false;
   }
 };
</script>

<template>
  <VForm   ref="refSettingForm"  @submit.prevent="submitForm">
  <VCard>
    <VCardTitle>General</VCardTitle>
    <VCardItem>
      <VRow class="mt-5 ps-5">
        <VCol cols="6" md="6">
          <ImagePicker
            custom_class="mt-10"
            image_label="Business Logo"
            :requiredValidator="requiredFile"
            placeholder="Business Logo"
            @select:image="processLogoFile"
          ></ImagePicker>

        </VCol>

        <VCol cols="6" md="6" v-if="settingsForm.logo_file?.id">
         <img :src="settingsForm.logo_file?.path" alt="logo" width="200px"/>
        </VCol>

      </VRow>
      <VRow class="mt-5">
        <VCol>
          <VTextField
            v-model="settingsForm.name"
            label="Name"
            width="300px"
            validate-on="submit"
            :rules="requiredRule"
            placeholder="Name"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="settingsForm.email"
            label="Email"
            type="email"
            width="300px"
            validate-on="submit"
            :rules="requiredRule"
            placeholder="Email"
          />
        </VCol>
      </VRow>
      <VRow class="mt-5">
        <VCol>
          <VTextField
            v-model="settingsForm.phone"
            label="Phone"
            width="300px"
            validate-on="submit"
            :rules="requiredRule"
            placeholder="Phone"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="settingsForm.kra_pin"
            label="KRA PIN"
            width="300px"
            validate-on="submit"
            :rules="requiredRule"
            placeholder="KRA PIN"
          />
        </VCol>
      </VRow>
      <VRow class="mt-5">
          <VCol>
            <VTextField
              v-model="settingsForm.slogan"
              label="Slogan"
              width="300px"
              validate-on="submit"
              :rules="requiredRule"
              placeholder="Slogan"
            />
          </VCol>
          <VCol>
            <VTextField
              v-model="settingsForm.address"
              label="Address"
              width="300px"
              validate-on="submit"
              :rules="requiredRule"
              placeholder="Address"
            />
          </VCol>
      </VRow>
    </VCardItem>
  </VCard>
  <VCard class="mt-5">
    <VCardTitle>Accounting</VCardTitle>
    <VCardItem>

      <VRow class="mt-5">
        <VCol>
          <QuillEditor
            theme="snow"
            toolbar="full"
            contentType="html"
            v-model:content="settingsForm.invoice_note"
            label="Invoice note"
            placeholder="Invoice note"
          />

        </VCol>
        <VCol>
          <QuillEditor
            theme="snow"
            contentType="html"
            toolbar="full"
            v-model:content="settingsForm.payment_note"
            label="Payment note"
            placeholder="Payment note"
          />

        </VCol>
      </VRow>
    </VCardItem>
    <VCardItem>
      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn
          :loading="loading"
          type="submit"
        >
          Submit
        </VBtn>
        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
          href="/account-settings"
        >
          Back
        </VBtn>
      </VCol>
    </VCardItem>
  </VCard>
  </VForm>
</template>

<style scoped>

</style>
