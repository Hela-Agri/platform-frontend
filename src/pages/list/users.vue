<script setup lang="ts">
import { getUsers } from '@/api/user'
import { formatDate, hasPermission } from '@/utils'

const users = ref([])

const headers = [
  { title: 'FIRST NAME', key: 'first_name' },
  { title: 'MIDDLE NAME', key: 'middle_name' },
  { title: 'LAST NAME', key: 'last_name' },
  { title: 'PHONE', key: 'phone_number' },
  { title: 'EMAIL', key: 'email' },
  { title: 'ROLE', key: 'role' },
  { title: 'CREATED', key: 'created_at' },
  { title: 'REG NO', key: 'registration_number' },
  { title: 'ACTION', key: 'action' },

]

const getUserList = async () => {
  try {
    getUsers({}).then(response => {
      if (response.data.success)
        users.value = response.data?.data?.data
      else
        console.log(response)
    })
  }
  catch (error) {
    console.log(error)
  }
}

const deactivateUser = async () => {

}

const activateUser = async () => {

}

onMounted(() => {
  getUserList()
})

interface User {
  name: string
  created_at: number
}

const formattedUsers = computed<User[]>(() => {
  return users.value.map(user => ({
    ...user,
    created_at: formatDate(user.created_at),
  }))
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>User List</VCardTitle>
      <template #append>
        <VBtn
          v-if="hasPermission('create.user')"
          size="small"
          prepend-icon="bx bx-plus"
          href="/form/user"
        >
          New User
        </VBtn>
      </template>
    </VCardItem>
  </VCard>
  <VDataTable
    v-if="hasPermission('list.user')"
    :headers="headers"
    :items="formattedUsers"
    :items-per-page="10"
    height="300"
    fixed-header
  >
    <!-- actions -->
    <template #item.action="{ item }">
      <VMenu>
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            variant="tonal"
            icon="bx bx-dots-vertical-rounded"
          />
        </template>
        <VList>
          <VListItem :href="`/form/user/${item.id}`">
            <IconBtn>
              <VIcon icon="bx-edit" />
            </IconBtn>Edit
          </VListItem>
          <VListItem @click="activateUser">
            <IconBtn>
              <VIcon icon="bx bx-check-circle" />
            </IconBtn>Activate
          </VListItem>
          <VListItem @click="deactivateUser">
            <IconBtn>
              <VIcon icon="bx bx-minus-circle" />
            </IconBtn>Deactivate
          </VListItem>
        </VList>
      </VMenu>
    </template>

    <!-- actions -->
    <template #item.role="{ item }">
      <VChip
        color="primary"
        class="font-weight-medium"
        size="small"
      >
        {{ item?.role?.name }}
      </VChip>
    </template>
  </VDataTable>
</template>
