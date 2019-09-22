<script>
	import { onMount } from 'svelte';
	import properties from '../properties-store.js';
	import LoadSpinner from '../components/UI/LoadSpinner.svelte';
	import Details from '../components/Details.svelte';
	import Preview from '../components/Preview.svelte';
	import Splash from '../components/UI/Splash.svelte';
	import Badge from '../components/UI/Badge.svelte';
	import Error from '../components/UI/Error.svelte';
	import Logo from '../components/UI/Logo.svelte';
	// import Map from '../components/Map.svelte';
	import { Map, controls } from '../components/Map/components.js';
	import Properties from '../components/Map/Properties.svelte';
	import Marker from '../components/Map/Marker.svelte';
	import * as api from 'api.js';

  const { NavigationControl, ScalingControl, GeolocateControl } = controls;

	if (typeof window !== 'undefined') {
		window.global = {}
	}
	let place = null;
	let center;
	let mapComponent;

	let pageData = {};
	let previewProperty = {};
	let isSplash = true;
	let isPreview = false;
	let isDetails = false;
	let isLoading = true;
	let error; // error display trigger




// console.log('PHONE: ', process.env.phoneNumber)
// console.log('FIREBASE: ', process.env.Firebase)

	onMount(() => {

		// fetch properties from firebase
		fetch(`${process.env.Firebase.baseURL}/cariari.json`)
			.then(res => {
				if (!res.ok) {
					throw new Error('Fetching on Properties failed, try again!');
				}
				return res.json();
			})
			.then(data => {
				console.log('raw data: ', data);
				// transform into workable data
				const loadedProperties = [];
				for (const key in data) {
					loadedProperties.push({
						...data[key],
						id: key
					});
				}
				console.log('formatted data: ', loadedProperties);
				// isLoading = false; // hide loading indicator (can it be moved to finally?)
				// push data into local store
				properties.setProperties(loadedProperties.reverse());
			})
			.catch(err => {
				console.log('Caught fetch error: ', err);
				error = err; // set error trigger to error, read error.message
			})
			.finally(() => {
				// cleanup
				isLoading = false;
			});

	});

	function placeChanged (e) {
		place = e.detail
		mapComponent.setCenter(e.detail.geometry, 14)
		console.dir(e.detail)
	}

	function showPreview(event) {
		isPreview = true;
		pageData.id = event.detail;
		const unsubscribe = properties.subscribe(items => {
			previewProperty = items.find(i => i.id === pageData.id);
		});
		unsubscribe();
	}

	function showDetails(event) {
		isDetails = true;
		pageData.id = event.detail;
		console.log('fired showDetails: ', event.detail)
	}

	function closeDetails() {
		isDetails = false;
		pageData = {}; // reset pageData object
	}

	function hideSplash() {
		isSplash = false;
	}

	function clearError() {
		error = null;
	}
</script>

<style>

</style>

<svelte:head>
	<title>Cariari Realty | CR</title>
</svelte:head>

{#if isSplash}
	<Splash on:splashed="{hideSplash}" />
{/if}

{#if error}
	<Error message="{error.message}" on:cancel="{clearError}" />
{/if}

{#if !isSplash}
	<Logo type="regular" color="gold" fixed="fixed" on:click="{() => isSplash = true }" />
{/if}

{#if isLoading}
	<LoadSpinner />
{:else}
	<!-- Main View -->
	<!-- <Map properties={$properties} on:showpreview={showPreview} /> -->

	<Map
		bind:this="{mapComponent}"
		on:ready="{() => {
			mapComponent.setCenter([-84.15756932466013, 9.973385405932916], 15, 14, 17);
			//mapComponent.setMaxBounds([
			//	[-84.1872, 9.948986],
			//	[-84.1277, 9.992531]
			//]);
		}}"
		accessToken="pk.eyJ1Ijoic2VjcmV0Z3Nwb3QiLCJhIjoiY2swaGQ1Y2UzMDFmNDNucHNqdGRxeHBzNSJ9.AWKJgnwQUyfggl5fKCAw_A"
		on:recentre="{ e => console.log(e.detail.center.lat, e.detail.center.lng) }"
		>
		<!--
		<Marker lat={9.97008} lon={-84.16643} label="Svelte Body Shaping"/>
		<Marker lat={9.971366} lon={-84.169614} label="Another item"/> -->

		{#each $properties as property}
			<Marker on:showpreview={showPreview}
				lat={property.location.lat} lon={property.location.lng}
				label="{property.msl}"
				{property} />
		{/each}

		<!-- <Properties propertiesData="{$properties}" /> -->

		<ScalingControl />
		<GeolocateControl />
		<NavigationControl />
	</Map>

	{#if isPreview}
		<!-- Preview side panel -->
		<Preview {previewProperty} on:showdetails={showDetails} />
	{/if}

	{#if isDetails}
		<!-- Details -->
		<Details id={pageData.id} on:close={closeDetails} />
	{/if}
{/if}
