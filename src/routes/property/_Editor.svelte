<script>
	import * as api from 'api.js';
	import { goto } from '@sapper/app';
	import { isAdmin, current, pattern, konami } from 'konami.js'; // to activate $isAdmin
	import { isEmpty } from 'validation.js';
	// import properties from "../../properties-store.js";
	import Error from "../../components/UI/Error.svelte";
	import Modal from "../../components/UI/Modal.svelte";
	import Button from "../../components/UI/Button.svelte";
	import Toggle from "../../components/UI/Toggle.svelte";
	import Logo from '../../components/UI/Logo.svelte';
	import StaticMap from "../../components/Map/StaticMap.svelte";

	export let property;
	export let query = false;
	export let slug = false;

	let inProgress = false;
	let formIsValid = false;
	let showModal = false;
	let errors;

  let over = {};
  let startLoc = 0;
  let dragging = false;
  let dragFrom = {};

	// workaround for empty photo and features array that are returned from firebase as string
	if (property.photos === undefined || property.photos.length == 0) property.photos = [];
	if (property.features === undefined || property.features.length == 0) property.features = [];

	// const { session } = stores();
	// console.log('session> ', session);
	// console.log('$properties> ', $properties);

	$: formIsValid =
			!isEmpty(property.msl) &&
			!isEmpty(property.property_for); // && isValidEmail(email);


	function startDrag(item, i, e) {
		startLoc = e.clientY;
		dragging = true;
		dragFrom = item;
		console.log(dragFrom, i);
	}

	function finishDrag(item, pos) {
		property.photos.splice(pos, 1)
		property.photos.splice(over.pos, 0, item);
		over = {}
		property.photos = property.photos;
	}

	function onDragOver(item, pos, e) {
		const dir = (startLoc < e.clientY) ? 'down': 'up';
		setTimeout(() => {
			over = { item, pos, dir };
		}, 50);
		console.log(dir, over);
	}

	function addFeature(input) {
		if (input.value == '') return;
		property.features = [...property.features, input.value];
		input.value = '';
	}
	function removeFeature(index) {
		property.features = [...property.features.slice(0, index), ...property.features.slice(index + 1)];
	}

	function addPhoto(input) {
		// let valInput = /(https?:\/\/.*\.(?:png|jpg|gif))/i;
		// if (!valInput.test(input.value)) return;
		if (input.value == '') return;
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
			? api.patch(`properties/${slug}.json`, {...property, date_updated: new Date()}, null)
			: api.post(`properties.json`, property, null));

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
			? api.del(`properties/${slug}.json`, null)
			: api.patch(`properties/${slug}.json`, {...property, is_active: false, date_updated: new Date()}, null));

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
		const response = await api.get(`properties.json`, null);
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
		background: var(--color-light);
		padding: 3rem 0;
		/* flex-wrap: wrap; */
	}

	fieldset input[type="text"],
	fieldset select,
	fieldset textarea {
		display: block;
		padding: 0.6rem 0.81rem;
		font-size: 1rem;
		line-height: 1.25;
		color: var(--color-black);
		border: 1px solid var(--color-white);
		border-radius: var(--border-radius);
		width: -webkit-fill-available;
		box-shadow: inset 0 3px 4px 0 var(--color-dark);
	}
	fieldset :global(button) {
		height: auto;
		width: 100%;
	}

	.section {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;
		grid-gap: 1rem;
		padding: 1rem 2rem 2rem;
		box-shadow: 0 1px 0px var(--color-dark), 0 2px 0px var(--color-light);
	}
	.section .header p { color: var(--color-darker); }
	.section fieldset {
		border: 0px dotted #e6e6e6;
		border-radius: var(--border-radius);
		margin: 0 0 2rem;
	}
	.section legend {
		text-transform: uppercase;
		font-size: 0.81em;
		color: var(--color-dark);
	}

	@media (min-width: 768px) {
		.section {
			grid-template-columns: minmax(auto, 270px) minmax(auto, 540px);
			grid-template-rows: 1fr;
			grid-gap: 2rem;
			padding: 2rem;
		}
		.section fieldset { margin: 0 0 2rem; }
	}

	.section_property_type .active { border: 1px solid var(--color-success); }
	.section_property_type .removed { border: 1px solid var(--color-danger); }
	.section_property_type .checkbox { display: inline-block; }
	.section_property_type .checkbox:nth-child(odd) { margin: 0 1rem; }

	.section_location .location input:first-of-type { border-bottom: 0; }
	.section_location .location input:last-of-type { border-top: 0; }
	.section_location .location :global(img) {
		width: 100%;
		padding: 1rem 0;
	}

	.section_features .feature-list { margin: 1rem 0; }
	.section_features .feature {
		display: inline-flex;
		align-items: center;
		background: var(--color-white);
		color: var(--color-darker);
		border-radius: var(--border-radius);
		padding: 0.2rem 0.4rem 0.2rem 0.2rem;
		margin: 0.2rem;
		box-shadow: 0 1px 2px var(--color-dark);
	}
	.section_features .feature .close {
		width: 18px;
		height: 18px;
		color: var(--color-dark);
		border-radius: var(--border-radius);
		margin-right: 0.2rem;
		position: relative;
		box-sizing: border-box;
		cursor: pointer;
		font-style: normal;
		font-weight: bold;
	}
	.section_features .feature .close::after {
		content: 'x';
		font-size: 0.6rem;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.section_features .description,
	.section_features .photos { grid-column: 1 / -1; }
	.section_features .photo-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(auto, 120px));
		/* grid-template-rows: repeat(auto-fit, minmax(90px, 120px)); */
		grid-gap: 1rem;
		justify-content: center;
		margin: 1rem 0;
	}
	.section_features .photo {
		position: relative;
		box-shadow: 0 1px 1px var(--color-white),
								0 2px 3px var(--color-darker);
		border-radius: var(--border-radius);
		text-align: center;
		display: flex;
		background-size: cover;
		height: 120px;
	}
	.section_features .photo .close {
		width: 27px;
		height: 27px;
		color: var(--color-danger);
		border: 1px solid var(--color-danger);
		border-radius: 50%;
		position: absolute;
		right: -9px;
		top: -9px;
		box-sizing: border-box;
		cursor: pointer;
		display: block;
		background: hsla(0, 0%, 100%, 0.81);
		font-style: normal;
	}
	.section_features .photo .close::after {
		content: 'x';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	footer.buttons-group {
		display: flex;
		padding: 2rem;
	}
	@media (min-width: 768px) {
		footer.buttons-group { justify-content: flex-end; }
		footer.buttons-group :global(button) {
			flex: 0 1 auto;
			width: 333px;
		}
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

	<div class="sections_wrap">
		<!-- PROPERTY TYPE -->
		<section class="section section_property_type">
			<div class="header">
				<h3>Property type</h3>
				<p>Categories listing in appropriate section and coloring on the map. Is part of filtering.</p>
			</div>

			<div class="inputs">
				{#if $isAdmin}
				<fieldset>
					<legend>Active</legend>
					<!-- <input type="text" placeholder="ex: true" bind:value="{property.is_active}" disabled="{!$isAdmin}"> -->
					<Toggle bind:checked="{property.is_active}" label="{property.is_active ? 'Listed' : 'Delisted'}" disabled="{!$isAdmin}" />
				</fieldset>
				{/if}

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
					<label class="checkbox">
						<input type="checkbox" bind:group="{property.property_for}" value="Rent"><span>Rent</span>
					</label>
					<label class="checkbox">
						<input type="checkbox" bind:group="{property.property_for}" value="Sale"><span>Sale</span>
					</label>
					<label class="checkbox">
						<input type="checkbox" bind:group="{property.property_for}" value="Investment"><span>Investment</span>
					</label>
				</fieldset>
			</div>
		</section>

		<!-- PROPERTY LOCATION -->
		<section class="section section_location">
			<div class="header">
				<h3>Location</h3>
				<p>GPS coordinates and physical address. Location displayed on map via GPS, accuracy is important.</p>
			</div>

			<div class="inputs">
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

					{#if property.location.lat && property.location.lng}
					<StaticMap lat="{property.location.lat}" lon="{property.location.lng}" zoom="15" marker="https://i.imgur.com/gA01omN.png" />
					{/if}
				</fieldset>
			</div>
		</section>

		<!-- PROPERTY CONTACTS -->
		<section class="section section_contacts">
			<div class="header">
				<h3>Contacts</h3>
				<p>Email and Phone number of a realtor or person selling the property, usually found on a placard in front of the property.</p>
			</div>

			<div class="inputs">
				<fieldset>
					<legend>Phone</legend>
					<input type="text" placeholder="ex: 1234-5678" bind:value="{property.contact_phone}">
				</fieldset>

				<fieldset>
					<legend>Email</legend>
					<input type="text" placeholder="ex: this@that.there" bind:value="{property.contact_email}">
				</fieldset>

				<fieldset>
					<legend>Realtor</legend>
					<input type="text" placeholder="ex: Re/Max or Jane Doe" bind:value="{property.contact_realtor}">
				</fieldset>
			</div>
		</section>

		<!-- PROPERTY BASICS -->
		<section class="section section_basics">
			<div class="header">
				<h3>Basics</h3>
				<p>These are initial values and usually first thing user looks for when narrowing down their options.</p>
			</div>

			<div class="inputs">
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
			</div>
		</section>

		<!-- PROPERTY DETAILS -->
		<section class="section section_details">
			<div class="header">
				<h3>Details</h3>
				<p>Information important to the user and thus should be filled in as soon as possible. Also used in filters.</p>
			</div>

			<div class="inputs">
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
					<legend>Rooms</legend>
					<input type="text" placeholder="ex: 6" bind:value="{property.rooms_count}">
				</fieldset>

				<fieldset>
					<legend>Parking Spaces</legend>
					<input type="text" placeholder="ex: 9" bind:value="{property.parking_spaces}">
				</fieldset>
			</div>
		</section>

		<!-- PROPERTY PRICING -->
		<section class="section section_pricing">
			<div class="header">
				<h3>Pricing</h3>
				<p>Everything regarding money goes in here and is very important since used in filters and relevent to user.</p>
			</div>

			<div class="inputs">
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
			</div>
		</section>

		<!-- PROPERTY FEATURES -->
		<section class="section section_features">
			<div class="header">
				<h3>Features</h3>
				<p>Description, features, photos. Photos are important and good quality should be provided.</p>
			</div>

			<div class="inputs">
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

				<fieldset class="description">
					<legend>Description</legend>
					<textarea rows="6" placeholder="Description (max 9 sentences)" bind:value="{property.description}"></textarea>
				</fieldset>

				<fieldset class="photos">
					<legend>Photos</legend>
					<input type="text" placeholder="ex: //placekitten.com/g/1080/810" use:enter={addPhoto}>
					<div class="photo-list">
						{#each property.photos as photo, i}
							<div class="photo"
									draggable={true}
									id={i}
									on:dragstart="{(e) => startDrag(photo, i, e)}"
									on:dragend="{(e) => finishDrag(photo, i, e)}"
									on:dragover="{(e) => onDragOver(photo, i, e)}"
									style="background-image: url({photo})">
								<i class="close" on:click="{() => removePhoto(i)}" />
								<!-- <img class="preview" src="{photo}" alt="{photo}"> -->
							</div>
						{/each}
					</div>
				</fieldset>
			</div>
		</section>

		<!-- BUTTONS -->
		<footer class="buttons-group">
			{#if slug && property.is_active && !$isAdmin}
				<Button type="button" color="danger" disabled={inProgress} on:click="{() => showModal = true}">Remove</Button>
			{/if}
			{#if slug && $isAdmin}
				<Button type="button" color="danger" disabled={inProgress} on:click="{() => showModal = true}">Delete</Button>
			{/if}

			{#if slug && $isAdmin}
				<Button type="button" disabled={inProgress} on:click="{() => { goto(`/property/${slug}?qr=true`) }}">Print</Button>
			{/if}

			<Button type="button" color="black" disabled={inProgress || !formIsValid} on:click="{publish}">
				{#if slug}
					Submit Changes
				{:else}
					Add Property
				{/if}
			</Button>
		</footer>
	</div>
</section>

<!-- CONFIRMATION MODAL -->
<Modal title="Delete listing?" bind:showModal>
	<div slot="content">
		Are you sure you want to delete this listing? By doing this, all data will be permenantly deleted.
	</div>
	<Button mode="clean" on:click={() => showModal = false}>Cancel</Button>
	<Button mode="danger"  on:click={() => { showModal = false; remove() }}>Confirm</Button>
</Modal>