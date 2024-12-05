<script lang="ts" setup>
import { Loader } from '@googlemaps/js-api-loader'
import { toast } from "vue3-toastify"
import { VCard, VCardItem, VTextField } from 'vuetify/components'

// Define the emit event types
const emit = defineEmits<{
  (e: 'set-area', payload: any): void
}>()

let _center: { lat: any; lng: any }
const mapContainer = ref(null)
let coords: any[] = []
const markers: any[] = []
let loader: Loader
const showLoader = ref(false)
let timer: string | number | NodeJS.Timeout | undefined
const isMapping = ref(false)
let autocomplete: {
  addListener: (arg0: string, arg1: () => void) => void
  getPlace: () => any
}
let polygon: {
  setPaths(coords: any[]): unknown
  getPath(): any
  setMap: (
    arg0: {
      addListener(arg0: string, arg1: (event: any) => void): unknown
      setCenter: (arg0: { lat: any; lng: any }) => void
    } | null
  ) => void
}
let map: {
  addListener(arg0: string, arg1: (event: any) => void): unknown
  setCenter: (arg0: { lat: any; lng: any }) => void
}

const error = ref('')

onMounted(async () => {
  getLocation()
})

const getLocation = () => {
  showLoader.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        if (position) {
          _center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          await initilizeMap()
          showLoader.value = false
        }
      },
      err => {
        showLoader.value = false
        error.value = `Error: ${err.message}`
      },
    )
  }
  else {
    showLoader.value = false
    error.value = 'Geolocation is not supported by this browser.'
  }
}

const initilizeMap = async () => {
  loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY, // standard vite env implementation
    version: 'weekly',
  })

  loader.load().then(async () => {
    map = new google.maps.Map(mapContainer.value, {
      center: _center,
      zoom: 23,
      mapTypeControl: false,
      mapId: 'farm-location',
    })

    // Create a new polygon with the updated list of markers
    polygon = new google.maps.Polygon({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    })
    polygon.setMap(map)
  })

  await loader.importLibrary('places')

  // the center, defaultbounds are not necessary but are best practices to limit/focus search results
  const center = { lat: 34.082298, lng: -82.284777 }

  // Create a bounding box with sides ~10km away from the center point
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  }

  // this const will be the first arg for the new instance of the Places API

  const input = document.getElementById('place') // binds to our input element

  // this object will be our second arg for the new instance of the Places API
  const options = {
    bounds: defaultBounds, // optional
    types: ['establishment'], // optioanl
    componentRestrictions: { country: 'ke' }, // limiter for the places api search
    fields: ['address_components', 'geometry', 'icon', 'name'], // allows the api to accept these inputs and return similar ones
    strictBounds: false, // optional
  }

  const Places = await loader.importLibrary('places')

  // per the Google docs create the new instance of the import above. I named it Places.
  autocomplete = new Places.Autocomplete(input, options)

  // add the place_changed listener to display results when inputs change
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace() // this callback is inherent you will see it if you logged autocomplete
    if (place) {
      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }

      map.setCenter(position)
    }
  })
}

function endMapping() {
  clearInterval(timer)
  isMapping.value=false;
  try {


    // Remove the polygon from the map

    if (coords.length >=3) {

      polygon.setPaths(coords)
      const area = google.maps.geometry.spherical.computeArea(polygon?.getPath())

      // Clear markers from the map
      for (let i = 0; i < markers.length; i++)
        markers[i].map = null // This removes the marker from the map

      coords = []

      // Remove the polygon from the map
      if (polygon) {
        polygon.setMap(null)
        polygon = null
      }
      emit('set-area', { area:area, unit_of_measure: 'Square Meter (m²)', coordinates: [] })
    }else{
      toast.error('insufficient points mapped. Unable to calculate area')
    }
  }
  catch (error) {
    toast.error(error)

    return null
  }

  // ;
}
async function addMarker(latLng: { lat: number; lng: number }) {
  const { AdvancedMarkerElement } = await loader.importLibrary('marker')

  const marker = new AdvancedMarkerElement({
    position: latLng,
    map,
  })

  // Add dblclick event listener to the marker
  marker.addListener('click', () => {
    removeMarker(marker, latLng)
  })
  markers.push(marker)
  coords.push(latLng)

  // If a polygon exists, remove it
  if (polygon)
    polygon.setMap(null)

  console.log(coords)
}
function updateMarker() {
  navigator.geolocation.getCurrentPosition(
    position => {
      if (position) {
        addMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      }
    },
    err => {
      error.value = `Error: ${err.message}`
    },
  )
}
async function startMapping() {
  try {
    isMapping.value=true;
    // Create a new polygon with the updated list of markers
    polygon = new google.maps.Polygon({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    })
    polygon.setMap(map)

    if (navigator.geolocation) {
      updateMarker()
      // Start the timer when the component is mounted
      timer = setInterval(updateMarker, 3000)
    }
    else {
      error.value = 'Geolocation is not supported by this browser.'
    }
  }
  catch (error) {
    console.error(error)

    return null
  }
}
function cancelMapping(){
  isMapping.value=false;
  clearInterval(timer)
  emit('set-area', { area:0, unit_of_measure: 'Square Meter (m²)', coordinates: [] })
}

function resetMapping() {
  try {
    // Clear markers from the map
    for (let i = 0; i < markers.length; i++)
      markers[i].map = null // This removes the marker from the map

    coords = []

    // Remove the polygon from the map
    if (polygon) {
      polygon.setMap(null)
      polygon = null
    }
  }
  catch (error) {
    console.error(error)

    return null
  }
  clearInterval(timer)

  // ;
}
function removeMarker(
  marker: { map: null; lat: () => any; lng: () => any },
  latlng: any,
) {
  marker.map = null // Removes the marker from the map

  const index = markers.indexOf(marker)
  if (index > -1)
    markers.splice(index, 1) // Remove the marker from the array

  const co_index = markers.indexOf(latlng)

  coords.splice(co_index, 1)
  if (polygon)
    polygon.setPaths(coords)
}
</script>

<template>
  <VCard>
    <VCardTitle>Calculate Area</VCardTitle>
    <VCardItem>
      <VRow class="float-end">
        <VCol
          cols="12"
          md="3"
        >
          <VBtn
            variant="flat"
            class="mx-2"
            color="secondary"
            @click="cancelMapping"
          >
            <VIcon
              color="white"
              icon="bx-x"
              size="24"
              class="mx-4"
            />
            Cancel Mapping
          </VBtn>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VBtn
            variant="flat"
            class="mx-2"
            color="error"
            @click="resetMapping"
          >
            <VIcon
              color="white"
              icon="bx-revision"
              size="24"
              class="mx-4"
            />
            Reset Mapping
          </VBtn>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VBtn
            :loading="isMapping"
            variant="flat"
            class="mx-2"
            color="warning"
            @click="startMapping"
          >
            <VIcon
              color="white"
              icon="bx-check"
              size="24"
              class="mx-4"
            />
            Start Mapping
          </VBtn>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VBtn
            variant="flat"
            class="ms-2"
            color="success"
            @click="endMapping"
          >
            <VIcon
              color="white"
              icon="bx-save"
              size="24"
              class="mx-4"
            />
            Save
          </VBtn>
        </VCol>
      </VRow>

    </VCardItem>

    <VTextField
      class="ps-5 pe-5"
      id="place"
      type="text"
      placeholder="Enter address to search location on the map ..."
    />

    <VCardItem
      v-if="showLoader"
      class="justify-center"
    >
      <VProgressCircular
        :size="50"
        width="2"
        color="primary"
        indeterminate
      />
    </VCardItem>

    <VCardItem>
      <div
        ref="mapContainer"
        class="map-container"
      />
    </VCardItem>
  </VCard>
</template>

<style scoped>
.map-container {
  block-size: 100vh;
  inline-size: 100%;
}
</style>
