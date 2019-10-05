<script>
  import { onMount } from "svelte";
  import properties from "../properties-store.js";
  import LoadSpinner from "../components/UI/LoadSpinner.svelte";
  import Details from "../components/Details.svelte";
  import Preview from "../components/Preview.svelte";
  import Splash from "../components/UI/Splash.svelte";
  import Logo from "../components/UI/Logo.svelte";
  import { Map, controls } from "../components/Map/components.js";
  import Marker from "../components/Map/Marker.svelte";
  import * as api from "api.js";

  const { NavigationControl, ScalingControl, GeolocateControl } = controls;

  if (typeof window !== "undefined") {
    window.global = {};
  }
  let mapComponent;

  let selectedProperty = {};
  let previewProperty = {};
  let isSplash = true;
  let isPreview = false;
  let isDetails = false;
  let isLoading = true;

  // console.log('PHONE: ', process.env.phoneNumber)
  // console.log('FIREBASE: ', process.env.Firebase)

  onMount(async () => {
    await api.get(`cariari.json`, null)
      .then(data => {
        // transform into workable data
        const loadedProperties = [];
        for (const key in data) {
          loadedProperties.push({
            ...data[key],
            id: key
          });
        }
        // push data into local store
        properties.setProperties(loadedProperties); // doesn't have to be .reverse()
        // turn off loading indicator
        isLoading = false;
        isSplash = false;
      });
  });

  function showPreview(event) {
    // if (!selectedProperty.id || !isPreview) { console.log('NO || NO') }
    // if (selectedProperty.id == event.detail && isPreview) {
    //   isPreview = false;
    //   selectedProperty = {};
    // } else {
      selectedProperty.id = event.detail;
      const unsubscribe = properties.subscribe(items => {
        previewProperty = items.find(i => i.id === selectedProperty.id);
      });
      unsubscribe();
      isPreview = true;
    // }
      setTimeout(() => {
        mapComponent.resize();
      }, 0);
      mapComponent.setCenter([previewProperty.location.lng, previewProperty.location.lat]);
      previewpane.scrollTo({top: 0, behavior: 'smooth'}); // is there better way to refer to a pane instead of id?
      // console.log("showPreview: ", selectedProperty.id);
  }

  function showDetails(event) {
    isDetails = true;
    // console.log("showDetails: ", selectedProperty.id);
  }

  function closeDetails() {
    isDetails = false;
    // selectedProperty = {}; // reset selectedProperty object
  }

  function hideSplash() {
    isSplash = false;
  }
</script>

<style>
  .main-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "map map"
      "map map";
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: var(--color-black);
    min-height: -webkit-fill-available;
  }
  .main-wrapper.previewing {
    grid-template-areas:
      "map map"
      "preview preview";
  }
  @media (orientation: landscape) {
    .main-wrapper.previewing {
      grid-template-areas:
        "map preview"
        "map preview";
    }
  }
  @media (min-width: 60em) and (orientation: landscape) {
    .main-wrapper {
      grid-template-columns: 1fr auto;
    }
  }

  .map {
    grid-area: map;
  }

  .preview {
    grid-area: preview;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
</style>

<svelte:head>
  <title>Cariari Realty | CR</title>
</svelte:head>

{#if isSplash}
  <Splash on:splashed={hideSplash} />
{/if}

{#if !isSplash}
  <Logo
    type="regular"
    color="gold"
    fixed="fixed"
    on:click={() => (isSplash = true)} />
{/if}

{#if isLoading}
  <LoadSpinner />
{:else}

  <section class="main-wrapper" class:previewing={isPreview}>
    <div class="map">
      <Map
        bind:this={mapComponent}
        on:ready={() => {
          mapComponent.setCenter([-84.15756932466013, 9.973385405932916], 15, 14, 17);
        }}
        accessToken="pk.eyJ1Ijoic2VjcmV0Z3Nwb3QiLCJhIjoiY2swaGQ1Y2UzMDFmNDNucHNqdGRxeHBzNSJ9.AWKJgnwQUyfggl5fKCAw_A">

        {#each $properties as property}
          {#if property.is_active}
          <Marker
            on:showpreview={showPreview}
            lat={property.location.lat}
            lon={property.location.lng}
            label={property.msl}
            {property} />
          {/if}
        {/each}

        <ScalingControl />
        <GeolocateControl />
        <NavigationControl />
      </Map>
    </div>

    <div class="preview" id="previewpane">
      {#if isPreview}
        <!-- Preview side panel -->
        <Preview {previewProperty} on:showdetails={showDetails} />
      {/if}
    </div>
  </section>

  {#if isDetails}
    <!-- Details -->
    <Details id={selectedProperty.id} on:close={closeDetails} />
  {/if}
{/if}
