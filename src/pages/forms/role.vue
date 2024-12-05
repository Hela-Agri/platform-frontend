<script lang="ts" setup>
import { createRole, getRole, updateRole } from '@/api/role';
import { getModules, getPermissions } from '@/api/user';
import { router } from '@/plugins/router';
import { onMounted, ref } from 'vue';
import { VCardItem, VDataTable } from 'vuetify/components';
  const permissions = ref({})
  const selected_permissions = ref([]);
  const modules = ref()
  const actions = ["list", "create", "edit", "view", "delete", "approve", "activate", "deactivate", "print", "download"];
  const isLoading = ref(false);
  const requiredRule = ref([
    (      value: any) => {
      if (value) {
        return true
      }

      return 'Field is required.'
    },
  ])
const form = ref({
    id: {},
    name: '',
    description: '',
   
  })

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })
const route = useRoute(); 
  
  const getModuleList = async () => {
    try {
      getModules({}).then(response => {
        if (response.data.success) {
          modules.value = response.data?.data?.data
        } else {
          console.log(response)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  const getPermissionList = async () => {
    try {
      getPermissions({}).then(response => {
        if (response.data.success) {
          permissions.value = response.data?.data
        } else {
          console.log(response)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getRoleData = async () => {
    try {
      getRole(form.value.id).then(response => {
        if (response.data.success) {
          form.value.name = response.data?.data?.name
          form.value.description = response.data?.data?.description
         
          response.data?.data?.permissions.forEach((perm:any) => {
            selected_permissions.value.push(perm?.id)
           
          })
         
        } else {
          console.log(response)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  
  onMounted(() => {
    
    form.value.id =  route.params.uuid;
    getModuleList();
    getPermissionList();
    getRoleData();
  })

const submitForm = async () => {

    try {
      if (form.value.id) {
          await updateRole(form.value.id,{
          name: form.value.name,
          description: form.value.description,
          permissions: JSON.parse(JSON.stringify(selected_permissions.value)),
          })
      } else {
         await createRole({
           name: form.value.name,
           description: form.value.description,
           permissions: JSON.parse(JSON.stringify(selected_permissions.value)),
          })
      }
    
      snackbar.value = {
        show: true,
        message: 'Role created successfully!',
        color: 'success',
      }
      await router.replace('/list/roles')
  }
  catch (error) {
    snackbar.value = {
      show: true,
      message: 'An error occurred. Please try again.',
      color: 'error',
    }
    console.log(error)
  }
}

</script>

<template>
  <VForm @submit.prevent="() => submitForm()" >
  <VCard>
    <VCardItem>
      <VCardTitle>Role Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCardItem>
        <VRow class="mt-2">
          <VCol cols="6" md="6">
            <VTextField
              v-model="form.name"
              label="Name"
              placeholder="Name"
              validate-on="submit"
              :rules="requiredRule"
            />
          </VCol>
          <VCol cols="6" md="6">
            <VTextField
              v-model="form.description"
              label="Description"
              placeholder="Description"
              validate-on="submit"
              :rules="requiredRule"
            />
          </VCol>
        </VRow>
      </VCardItem>
    </VCard>
    <VCard>
      <VCardItem>
        <VCardTitle>Permissions</VCardTitle>
      </VCardItem>
      <VCardItem>
        <VDataTable
        :items-per-page="10"
        height="500"
        fixed-header  
        >
          <thead>
          
          <tr>
            <th class="text-left">
            Module
            </th>
            <th v-for="action in actions" class="text-left">
              {{action}}
            </th>
            
          </tr>
          </thead>
          <tbody>
          
            <tr v-for="(permission, _module) in permissions" :key="_module">
              <td class="text-uppercase	">
                {{ _module }}
              </td>
               <td v-for="action in actions" >
                <VIcon
                 v-if="!permission[action]"
      color='#b14141'
      class="ms-1"
      icon="bx-minus-circle"
      size="large"
    ></VIcon> 
                <VCheckbox
                      v-if="permission[action]"
                      :value="permission[action]"
                      v-model="selected_permissions"
                   
                  >
                </VCheckbox>

               </td>
            </tr>
          </tbody>

        </VDataTable>
      </VCardItem>
      <VCardItem>
          <VRow>
            <VCol
              cols="12"
              class="d-flex gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                 href="/list/roles"
              >
                Back
              </VBtn>
            </VCol>
          </VRow>
      </VCardItem>
    </VCard>
  </VCard>
</VForm>
</template>
