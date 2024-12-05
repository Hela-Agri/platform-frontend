<script setup lang="ts">
import { onMounted } from "vue";
import { VRow } from "vuetify/components";
const imageData = ref();
const _custom_class = ref();
onMounted(() => {
  _custom_class.value='file-input '+props.custom_class;
});
const props = defineProps<{
  image_label: string;
  requiredValidator: object;
  placeholder: string;
  custom_class: string;
}>();

const emit = defineEmits<{
  (e: "select:image", value: File): void;
}>();
const onFileSelected = (event: { target: { files: any[] } }) => {
  const file = event.target.files[0];
  emit("select:image", file);
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageData.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imageData.value = null; // Reset if the file is not an image
  }
};
</script>
<template>
  <VRow>
    <VFileInput
      :rules="requiredValidator"
      :class="_custom_class"
      accept="image/png, image/jpeg,image/jpg, image/bmp,image/gif,image/webp,image/svg,image/tiff,image/heic,image/heif"
      :label="image_label"
      :placeholder="placeholder ?? image_label"
      prepend-icon="bx bx-camera"
      @input="onFileSelected"
    ></VFileInput>
  </VRow>
  <VRow class="justify-center mt-5">
    <div v-if="imageData" class="image-container">
      <img :src="imageData" alt="Image Preview" /></div
  ></VRow>
</template>
<style scoped>
.image-container {
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc; /* Optional: to visualize the container */
  block-size: 150px;
  inline-size: 150px; /* Adjust the width and height as needed */
}

img {
  block-size: 100%;
  inline-size: 100%;
  object-fit: contain; /* Ensures the image fits inside without stretching */
}
</style>
