<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import axios from 'axios'

const props = defineProps<{
  dialog: boolean
}>()

const emit = defineEmits<{
  (e: 'set-location', payload: any): void
}>()

const mapContainer = ref(null)
let latlong: { lat: any; lng?: any }
let map: {
  addListener(arg0: string, arg1: (event: any) => void): unknown
  setCenter: (arg0: { lat: any; lng: any }) => void
}
let autocomplete: {
  addListener: (arg0: string, arg1: () => void) => void
  getPlace: () => any
}
let marker: {
  position: { lat: any; lng: any }
  setPosition: (arg0: any) => void
}
const error = ref(null)

// Adds a marker to the map and push to the array.
function setMarker(position: { lat: any; lng: any }) {
  latlong = position
  map.setCenter(position)
  marker.position = position
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (position) {
          setMarker({
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
  else {
    error.value = 'Geolocation is not supported by this browser.'
  }
}

const initilizeMap = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY, // standard vite env implementation
    version: 'weekly',
  })

  loader.load().then(async () => {
    const { AdvancedMarkerElement } = await loader.importLibrary('marker')

    map = new google.maps.Map(mapContainer.value, {
      center: { lat: -1.286389, lng: 36.817223 },
      zoom: 16,
      mapTypeControl: false,
      mapId: 'farm-location',
    })
    marker = new AdvancedMarkerElement({
      position: { lat: -1.286389, lng: 36.817223 },
      map,
      gmpDraggable: true,
    })

    getLocation()

    // Add an event listener for the dragend event
    google.maps.event.addListener(marker, 'dragend', event => {
      latlong = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
    })
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

  // This event listener will call addMarker() when the map is clicked.

  // add the place_changed listener to display results when inputs change
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace() // this callback is inherent you will see it if you logged autocomplete

    const position = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }

    setMarker(position)
  })
}

watch(() => props.dialog, newVal => {
  if (newVal)
    initilizeMap()
})

// Define the emit event types

async function selectLocation() {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latlong.lat},${latlong.lng}`,
          key: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
        },
      },
    )

    if (response.data.status === 'OK')
      emit('set-location', response.data.results)
    else
      throw new Error(`Geocoding failed: ${response.data.status}`)
  }
  catch (error) {
    console.error(error)

    return null
  }

  // ;
}
</script>

<template>
  <div class="text-center pa-4">
    <!-- Dialog component -->
    <VDialog
      v-model="props.dialog"
      max-width="1600"
    >
      <VCard
        prepend-icon="bx bx-check-circle"
        title="Location Picker"
      >
        <VCardText>
          <VToolbar color="primary">
            <VToolbarTitle>Select Farm Location</VToolbarTitle>

            <VSpacer />
            <VToolbarItems>
              <VBtn
                variant="text"
                @click="selectLocation"
              >
                <VIcon
                  color="white"
                  icon="bx-check"
                  size="24"
                  class="mx-4"
                />
                Save
              </VBtn>
            </VToolbarItems>
          </VToolbar>
          <VTextField
            id="place"
            type="text"
            placeholder="Enter address"
          />
          <div
            ref="mapContainer"
            class="map-container"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.map-container {
  block-size: 100vh;
  inline-size: 100%;
}
</style>
