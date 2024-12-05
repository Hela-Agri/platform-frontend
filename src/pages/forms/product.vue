<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import {addProduct, getProduct, updateProduct} from '@/api/product'
import { router } from '@/plugins/router'
import {getCategories} from "@/api/category";
import {getUnits} from "@/api/shared";


const form = ref({
  id: '',
  name: '',
  description: '',
  category_id: '',
  unit_id: '',
  pack_size: '',
})
const route = useRoute()
const categories = ref()
const units = ref()
const loading = ref<boolean>(false)

const refProductForm = ref()

const fetchCategories = async () => {
  loading.value = true
  try {
    getCategories({}).then(response => {
      if (response?.data?.success) {
        categories.value = response.data?.data?.data.map((category:any) => ({
          ...category,
          name: `${category?.name}`.trim(),
        }))
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
const fetchProduct = async () => {
  loading.value = true
  try {
    getProduct(form.value.id).then(response => {
      if (response?.data?.success) {
        form.value.name=response?.data?.data?.name;
        form.value.description=response?.data?.data?.description;
        form.value.category_id=response?.data?.data?.category_id;
        form.value.unit_id=response?.data?.data?.unit_id;
        form.value.pack_size=response?.data?.data?.pack_size;
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

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchCategories()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await fetchUnits()

  form.value.id = <string>route.params.uuid

  if(form.value.id){//its an edit so get the current product to be editted
    await fetchProduct();
  }

})
const fetchUnits = async () => {
  loading.value = true
  try {
    getUnits({classification:'product'}).then(response => {
      if (response?.data?.success) {
        units.value = response.data?.data?.data.map((unit:any) => ({
          ...unit,
          name: `${unit?.name}`.trim(),
        }))
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

const submitForm = async () => {
  refProductForm.value?.validate().then((valid: any) => {
    if (valid.valid) {
      try {
        if(form.value.id){
          updateProduct(form.value.id,{
            name: form.value.name,
            description: form.value.description,
            pack_size: form.value.pack_size,
            category_id: form.value.category_id,
            unit_id: form.value.unit_id,
          }).then(async response => {
            loading.value = false
            await router.replace('/list/products')
            toast.success(response.data.message)

          })
        }else{
          addProduct({
            name: form.value.name,
            description: form.value.description,
            pack_size: form.value.pack_size,
            category_id: form.value.category_id,
            unit_id: form.value.unit_id,
          }).then(async response => {
            loading.value = false
            toast.success(response.data.message)
            await router.replace('/list/products')
          })
        }

      }
      catch (error) {
        loading.value = false
        console.log(error)
      }
    } else {
      loading.value = false
      toast.error('Kindly fill in all required fields')
    }
  })
  loading.value = true

}

const requiredRule = ref<Array<(value: string) => boolean | string>>([
  value => {
    if (value)
      return true

    return 'Field is required.'
  },
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Product Form</VCardTitle>
    </VCardItem>
    <VCard>
      <VCol>
        <VForm   ref="refProductForm"  @submit.prevent="submitForm">
          <VRow>
            <!-- 👉 Product Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Product Name"
                placeholder="Product Name"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>
            <!-- 👉 Description -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.description"
                label="Description"
                placeholder="Description"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>
            <!-- 👉 pack_size -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.pack_size"
                label="Pack Size"
                placeholder="Pack Size"
                validate-on="submit"
                :rules="requiredRule"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
            <VSelect
              v-model="form.category_id"
              label="Select Category"
              placeholder="Select Category"
              :items="categories"
              item-title="name"
              item-value="id"
              validate-on="submit"
              :rules="requiredRule"
              @update:model-value="getCategories"
            />
      </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="form.unit_id"
                label="Select  Unit of Measure"
                placeholder="Select Unit of Measure"
                :items="units"
                item-title="name"
                item-value="id"
                validate-on="submit"
                :rules="requiredRule"
                @update:model-value="getUnits"
              />
            </VCol>




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
                href="/list/products"
              >
                Back
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCol>
    </VCard>
  </VCard>
</template>
