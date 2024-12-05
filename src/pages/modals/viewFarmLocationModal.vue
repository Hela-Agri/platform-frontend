<script lang="ts" setup>
import { Loader } from "@googlemaps/js-api-loader";
const props = defineProps<{
  dialog: boolean;
  latlong: { lat?: any; lng?: any };
}>();
let map: {
  addListener(arg0: string, arg1: (event: any) => void): unknown;
  setCenter: (arg0: { lat: any; lng: any }) => void;
};
const mapContainer = ref(null);
const emit = defineEmits(["update:dialog"]);
onMounted(async () => {});
// Watch the dialog prop to detect when it opens
watch(
  () => props.dialog,
  (newVal) => {
    if (newVal) {
      // Load the map when the dialog opens
      if (props.dialog) {
        initilizeMap();
      }
    }
  }
);

const initilizeMap = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY, //standard vite env implementation
    version: "weekly",
  });

  loader.load().then(async () => {
    const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    //props.latlong
    console.log(props.latlong);
    map = new google.maps.Map(mapContainer.value, {
      center: props.latlong,
      zoom: 16,
      mapTypeControl: false,
      mapId: "farm-location",
    });
    new AdvancedMarkerElement({
      position: props.latlong,
      map: map,
      gmpDraggable: false,
    });
  });
};
</script>
<template>
  <div class="text-center pa-4">
    <!-- Dialog component -->
    <VDialog v-model="props.dialog" width="50%">
      <VCard prepend-icon="bx bx-pin" title="Farm Location">
        <VCardItem> <div ref="mapContainer" class="map-container"></div> </VCardItem>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <VBtn @click="emit('update:dialog', false)"> Close </VBtn>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
<style scoped>
.map-container {
  block-size: 60vh;
  inline-size: 100%;
}
</style>
