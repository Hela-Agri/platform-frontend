<script lang="ts" setup>

import { getRoles } from '@/api/role';
import { hasPermission } from "@/utils"
import { onMounted } from 'vue';
import { VDivider } from 'vuetify/components';

  const items = ref()

  const headers = ref([
    { title: 'NAME', key: 'name' },
    { title: 'PERMISSIONS', key: 'permissions' },
  ])

  const getRolesList = async () => {
    try {
      getRoles({}).then(response => {
        if (response.data.success) {
          items.value = response.data?.data?.data
        } else {
          console.log(response)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
 
onMounted(() => {
    getRolesList()
  })

   
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Roles List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.role')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/role"
        >
          New Role
        </VBtn>
      </template>
    </VCardItem>
    <VCardItem  v-if="hasPermission('list.role')" v-for="role in items" :key="role" >
     
      <VRow class="mt-5 ms-5"> 
        <VCol :md="3" >
          <VSheet><h3>{{role.name}}</h3></VSheet>
          <VRow class="my-2" v-if="!role.system">
            <VBtn  v-if="hasPermission('edit.role')" :href="`/form/role/${role.id}`" variant="outlined" size="sm" class="mx-3 px-5" color="primary">
              Edit
            </VBtn>
            <VBtn  v-if="hasPermission('delete.role')" variant="outlined" size="sm" class="px-5" color="error">
              Delete
            </VBtn>
          </VRow>

        </VCol>
        <VCol :md="9">
          <VRow>



            <VCol :md="2" v-for="perm in role.permissions" :key="perm">
              <VSheet>{{ perm.name }}</VSheet>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <VDivider></VDivider>

    
    </VCardItem>
  </VCard>
</template>
