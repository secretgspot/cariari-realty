<script>
	import * as api from 'api.js';
	import { goto } from '@sapper/app';
	import {isAdmin, current, pattern, konami} from 'konami.js'; // to activate $isAdmin
	// import properties from "../../properties-store.js";
	import Error from "../../components/UI/Error.svelte";
	import Button from "../../components/UI/Button.svelte";
	import Toggle from "../../components/UI/Toggle.svelte";
	import Logo from '../../components/UI/Logo.svelte';

	export let property;
	export let query = false;
	export let slug = false;

	let inProgress = false;
	let errors;

	// workaround for empty photo and features array that are returned from firebase as string
	if (property.photos === undefined || property.photos.length == 0) property.photos = [];
	if (property.features === undefined || property.features.length == 0) property.features = [];

	// const { session } = stores();
	// console.log('session> ', session);
	// console.log('$properties> ', $properties);

	function addFeature(input) {
		property.features = [...property.features, input.value];
		input.value = '';
	}
	function removeFeature(index) {
		property.features = [...property.features.slice(0, index), ...property.features.slice(index + 1)];
	}

	function addPhoto(input) {
		property.photos = [...property.photos, input.value];
		input.value = '';
	}
	function removePhoto(index) {
		property.photos = [...property.photos.slice(0, index), ...property.photos.slice(index + 1)];
	}

	// Helper function to allow on Enter events for AddFeature, AddPhoto
	function enter(node, callback) {
		function onkeydown(event) {
			if (event.which === 13) callback(node);
		}
		node.addEventListener('keydown', onkeydown);
		return {
			destroy() {
				node.removeEventListener('keydown', onkeydown);
			}
		};
	}

	async function publish() {
		inProgress = true;

		const response = await (slug
			? api.patch(`cariari/${slug}.json`, {...property, date_updated: new Date()}, null)
			: api.post(`cariari.json`, property, null));

			console.log('response: ', response)
		if (response.name) {
			// Add new property to properties store
			// properties.addProperty({...property, id: response.name}); // 🚩🚩🚩FIXIT

			// page with QR code for printing
			goto(`property/${response.name}?qr=true`);
		} else {
			// update store with modified property by slug as id/name
			// properties.updateProperty(slug, response); // 🚩🚩🚩FIXIT
			// console.log('$properties> ', $properties);
		}

		inProgress = false;
	}

	async function remove() {
		inProgress = true;

		const response = await (slug && $isAdmin
			? api.del(`cariari/${slug}.json`, null)
			: api.patch(`cariari/${slug}.json`, {...property, is_active: false, date_updated: new Date()}, null));

			console.log('response: ', response)
		if (response) {
			// Client removed property from being listed (is_active:false)
			// ⬜ update store is_active to false
			alert('Your propert has been removed! Thank you for using our service. If  you would like to relist, please contact us at contact@cariari.realty');
			goto(`/`);
		} else {
			// admin deleted property from db
			// ⬜ remove property from store
			// ✔ redirect to /property/
			goto(`property`);
		}

		inProgress = false;
	}

	async function getMsl() {
		const response = await api.get(`cariari.json`, null);
		let digits = [];
		for (let [key, value] of Object.entries(response)) {
			digits = [...digits, Number(value.msl.substring(3))];
			// console.log(digits);
		}
		property.msl = `CR-${ Math.max(...digits) + 1 }`;
	}

	function getPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				property.location.lat = position.coords.latitude;
				property.location.lng = position.coords.longitude;
				// console.log('position> ', position);
			}, function() {
				console.log('FAILED TO GET POSITION');
			}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
		} else {
			// Browser doesn't support Geolocation
			console.log('YOUR BROWSER DOESN"T SUPPORT NAVIGATION');
		}
	}
</script>


<style>
	.edit-property {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		/* flex-wrap: wrap; */
	}
	.form-wrap {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		margin: 3rem 0rem 3rem;
		grid-row-gap: 1rem;
		/* grid-template-columns: repeat(auto-fit, minmax(222px, 1fr)); */
		/* grid-template-columns: repeat(3, 1fr); */
		/* margin: 6rem 6rem 3rem; */
	}
	@media (min-width: 1024px) {
		.form-wrap {
			grid-template-columns: repeat(auto-fit, minmax(246px, 1fr));
			width: 90vw;
		}
	}

	fieldset {
		border: 0px dotted #e6e6e6;
		border-radius: 9px;
	}
	legend {
		text-transform: uppercase;
		font-size: 0.6em;
		font-family: sans-serif;
	}
	fieldset.active { background: var(--color-cyan); }
	fieldset.removed { background: var(--color-magenta); }

	fieldset input[type="text"],
	fieldset select,
	fieldset textarea {
		display: block;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		line-height: 1.25;
		color: #55595c;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 0.25rem;
		width: -webkit-fill-available;
	}

	fieldset :global(button) {
		height: auto;
		width: 100%;
	}

	fieldset.location input:first-of-type { border-bottom: 0; }
	fieldset.location input:last-of-type {
		border-top: 0;
		/* border-bottom-right-radius: 0;
		border-bottom-left-radius: 0; */
	}
	/* fieldset.location :global(button) {
		border-top-right-radius: 0;
		border-top-left-radius: 0;
	} */

	.feature-list {
		margin: 1rem 0;
	}
	.feature {
		display: inline-flex;
		align-items: center;
		/* border: 1px solid var(--color-black); */
		background: var(--color-light);
		color: var(--color-darker);
		border-radius: 6px;
		padding: 0.2rem 0.4rem 0.2rem 0.2rem;
		margin: 0.2rem;
	}
	.feature .close {
		width: 18px;
		height: 18px;
		color: var(--color-dark);
		/* border: 1px dotted var(--color-magenta); */
		border-radius: 9px;
		margin-right: 0.2rem;
		position: relative;
		box-sizing: border-box;
		cursor: pointer;
		font-style: normal;
		font-weight: bold;
	}
	.feature .close::after {
		content: 'x';
		font-size: 0.6rem;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.section-description,
	.section-photos { grid-column: 1 / -1; }
	.photo-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(auto, 120px));
		/* grid-template-rows: repeat(auto-fit, minmax(90px, 222px)); */
		grid-gap: 1rem;
		justify-content: center;
		margin: 1rem 0;
	}
	.photo {
		position: relative;
		border: 1px solid var(--color-black);
		border-radius: 9px;
		text-align: center;
		overflow: hidden;
		display: flex;
	}
	.photo .preview {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.photo .close {
		width: 27px;
		height: 27px;
		color: var(--color-magenta);
		border: 1px solid var(--color-magenta);
		border-radius: 6px;
		position: absolute;
		right: 0;
		top: 0;
		box-sizing: border-box;
		cursor: pointer;
		display: block;
	}
	.photo .close::after {
		content: 'x';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	footer.buttons-group {
		/* margin: 3rem 6rem 6rem; */
		margin: 1rem 2rem 6rem;
		display: flex;
		align-self: stretch;
	}
</style>

<svelte:window on:keydown="{konami}"/>

<svelte:head>
	{#if slug}
		<title>Edit {property.msl}</title>
	{:else}
		<title>Add new property</title>
	{/if}
</svelte:head>

{#if errors}
	<Error message="{errors.message}" />
{/if}

<Logo type="regular" color="bw" fixed="fixed" on:click="{() => goto('/')}" />

<section class="edit-property">

	<!-- <h1>Edit/Client view {slug} {JSON.stringify(query, null, 2)}</h1> -->

	<div class="form-wrap">

		<fieldset>
			<legend>Active</legend>
			<!-- <input type="text" placeholder="ex: true" bind:value="{property.is_active}" disabled="{!$isAdmin}"> -->
			<Toggle bind:checked="{property.is_active}" label="{property.is_active ? 'Listed' : 'Delisted'}" disabled="{!$isAdmin}" />
		</fieldset>

		<fieldset class="{property.is_active ? 'active' : 'removed'}">
			<legend>MSL</legend>
			<input type="text" placeholder="ex: CR-001" bind:value="{property.msl}" disabled="{query.msl}" />
			{#if !property.msl}
			<Button type="button" on:click="{getMsl}">Set</Button>
			{/if}
		</fieldset>

		<fieldset>
			<legend>Land Use</legend>
			<select bind:value="{property.land_use}" disabled="{query.msl}">
				<option>Residential</option>
				<option>Commercial</option>
				<option>Industrial</option>
			</select>
		</fieldset>

		<fieldset>
			<legend>Property For</legend>
			<label>
				<input type="checkbox" bind:group="{property.property_for}" value="Rent">	Rent
			</label>
			<label>
				<input type="checkbox" bind:group="{property.property_for}" value="Sale">	Sale
			</label>
			<label>
				<input type="checkbox" bind:group="{property.property_for}" value="Investment">	Investment
			</label>
		</fieldset>

		<fieldset>
			<legend>Address</legend>
			<input type="text" placeholder="ex: Avenida 52, Provincia Heredia, La Asunción, 40703" bind:value="{property.address}">
		</fieldset>

		<fieldset class="location">
			<legend>Location (lat, lng)</legend>
			<input type="text" placeholder="ex: 9.97542" bind:value="{property.location.lat}" disabled="{query.msl}">
			<input type="text" placeholder="ex: -84.163443" bind:value="{property.location.lng}" disabled="{query.msl}">
			{#if !query.msl}
			<Button type="button" on:click="{getPosition}">Get current GPS</Button>
			{/if}
		</fieldset>

		<fieldset>
			<legend>Email</legend>
			<input type="text" placeholder="ex: this@that.there" bind:value="{property.contact_email}">
		</fieldset>

		<fieldset>
			<legend>Phone</legend>
			<input type="text" placeholder="ex: 1234-5678" bind:value="{property.contact_phone}">
		</fieldset>

		<fieldset>
			<legend>Year built</legend>
			<input type="text" placeholder="ex: 2019" bind:value="{property.year_built}">
		</fieldset>

		<fieldset>
			<legend>Building Style</legend>
			<input type="text" placeholder="ex: 2 Storey" bind:value="{property.building_style}">
		</fieldset>

		<fieldset>
			<legend>Lot Size ㎡</legend>
			<input type="text" placeholder="ex: 900" bind:value="{property.lot_size}">
		</fieldset>

		<fieldset>
			<legend>Building Size ㎡</legend>
			<input type="text" placeholder="ex: 810" bind:value="{property.building_size}">
		</fieldset>

		<fieldset>
			<legend>Parking Spaces</legend>
			<input type="text" placeholder="ex: 9" bind:value="{property.parking_spaces}">
		</fieldset>

		<fieldset>
			<legend>Rooms</legend>
			<input type="text" placeholder="ex: 6" bind:value="{property.rooms_count}">
		</fieldset>

		<fieldset>
			<legend>Bedrooms</legend>
			<input type="text" placeholder="ex: 3" bind:value="{property.beds_count}">
		</fieldset>

		<fieldset>
			<legend>Bathrooms</legend>
			<input type="text" placeholder="ex: 3" bind:value="{property.baths_count}">
		</fieldset>

		<fieldset>
			<legend>Restrooms (half-baths)</legend>
			<input type="text" placeholder="ex: 2" bind:value="{property.half_baths_count}">
		</fieldset>

		<fieldset>
			<legend>Price $</legend>
			<input type="text" placeholder="ex: 630000" bind:value="{property.price}">
		</fieldset>

		<fieldset>
			<legend>Rent ($/month)</legend>
			<input type="text" placeholder="ex: 1800" bind:value="{property.rent}">
		</fieldset>

		<fieldset>
			<legend>Taxes ($/year)</legend>
			<input type="text" placeholder="ex: 1500" bind:value="{property.taxes}">
		</fieldset>

		<fieldset>
			<legend>Fees (condo, asssociation) ($/month)</legend>
			<input type="text" placeholder="ex: 120" bind:value="{property.fees}">
		</fieldset>

		<fieldset>
			<legend>Features</legend>
			<input type="text" placeholder="ex: BBQ" use:enter={addFeature}>
			<div class="feature-list">
				{#each property.features as feature, i}
					<span class="feature">
						<i class="close" on:click="{() => removeFeature(i)}" />
						{feature}
					</span>
				{/each}
			</div>
		</fieldset>

		<fieldset class="section-description">
			<legend>Description</legend>
			<textarea rows="6" placeholder="Description (max 9 sentences)" bind:value="{property.description}"></textarea>
		</fieldset>

		<fieldset class="section-photos">
			<legend>Photos</legend>
			<input type="text" placeholder="ex: //placekitten.com/g/1080/810" use:enter={addPhoto}>
			<div class="photo-list">
				{#each property.photos as photo, i}
					<div class="photo">
						<i class="close" on:click="{() => removePhoto(i)}" />
						<img class="preview" src="{photo}" alt="{photo}">
					</div>
				{/each}
			</div>
		</fieldset>

	</div>

	<footer class="buttons-group">
		{#if slug && property.is_active && !$isAdmin}
			<Button type="button" color="magenta" disabled={inProgress} on:click="{remove}">Remove</Button>
		{/if}
		{#if slug && $isAdmin}
			<Button type="button" color="magenta" disabled={inProgress} on:click="{remove}">Delete</Button>
		{/if}

		{#if slug && !inProgress}
			<Button type="button" disabled={inProgress} href="/property/{slug}?qr=true">Print</Button>
		{/if}

		<Button type="button" disabled={inProgress} on:click="{publish}">
			{#if slug}
				Submit Changes
			{:else}
				Add Property
			{/if}
		</Button>
	</footer>


</section>

<!-- <pre>
{JSON.stringify(property, null, 2)}
</pre> -->
