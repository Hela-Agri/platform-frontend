<script lang="ts" setup>
const props = defineProps<{
  dialog: boolean;
  images: [];
}>();
const emit = defineEmits(["update:dialog"]);
</script>
<template>
  <div class="text-center pa-4">
    <!-- Dialog component -->
    <VDialog v-model="props.dialog" width="50%">
      <VCard prepend-icon="bx-images" title="Site Photos">
        <VCardItem>
          <VCarousel>
            <VCarousel-item v-for="img in images" :src="img" cover></VCarousel-item>
          </VCarousel>
        </VCardItem>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <VBtn @click="emit('update:dialog', false)"> Close </VBtn>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
<style scoped></style>
