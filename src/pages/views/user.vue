<script setup lang="ts">
 import {ref} from "vue";
 import '@vueup/vue-quill/dist/vue-quill.snow.css';
 import {getUser} from "@/api/user";
 const route = useRoute()
 const loading = ref<boolean>(false)
 const user= ref([])
 const fetchUser = async (uuid:string) => {
   loading.value = true
   try {
     getUser(uuid).then(response => {
       if (response?.data?.success) {
         user.value=response?.data?.data;

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

   if(<string>route.params.uuid){//its an edit so get the current product to be editted
     await fetchUser(<string>route.params.uuid);
   }

})

</script>

<template>

  <VCard>
    <VCardTitle>Personal Info</VCardTitle>
    <VCardItem>

      <VRow>
        
        <VCol cols="6" md="6">
          <div class="d-flex flex-row mb-6">
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2">First Name</v-sheet>
              <v-sheet class="ma-2 pa-2">Middle Name</v-sheet>
              <v-sheet class="ma-2 pa-2">Last Name</v-sheet>
              <v-sheet class="ma-2 pa-2">ID/Passport No</v-sheet>
            </div>
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2"><b>: {{user?.first_name??'-'}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>: {{user?.middle_name??'-'}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>: {{user.last_name??'-'}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>: {{user.registration_number??'-'}}</b></v-sheet>
            </div>
          </div>
        </VCol>
        <VCol cols="6" md="6">
          <div class="d-flex flex-row mb-6">
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2">Phone No.</v-sheet>
              <v-sheet class="ma-2 pa-2">Email</v-sheet>
              <v-sheet class="ma-2 pa-2">Username</v-sheet>
              <v-sheet class="ma-2 pa-2">Role</v-sheet>
            </div>
            <div class="d-flex flex-column mb-6">
              <v-sheet class="ma-2 pa-2"><b>: {{user?.phone_number}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>: {{user?.email}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>: {{user?.username}}</b></v-sheet>
              <v-sheet class="ma-2 pa-2"><b>: {{user?.role?.name}}</b></v-sheet>
            </div>
          </div>
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
          :href="`/form/user/${user?.id}`"
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
