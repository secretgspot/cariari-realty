<script context="module">
	import * as api from 'api.js';

	export async function preload({ params }) {
		const properties = await api.get(`cariari.json`, null);
		// transform data into workable
		const loadedProperties = [];
		for (const key in properties) {
			loadedProperties.push({
				...properties[key],
				id: key
			});
		}
		return { fetchedProperties: loadedProperties.reverse() };
	}
</script>

<script>
	import { goto } from '@sapper/app';
	import Logo from "../../components/UI/Logo.svelte";
	import Button from "../../components/UI/Button.svelte";
	import Filter from "../../components/UI/Filter.svelte";
	import {isAdmin, current, pattern, konami} from 'konami.js'; // to activate $isAdmin

	export let fetchedProperties;
	// console.log('>>> ', fetchedProperties);
	let filter;
	let view_style = 'grid';

	const filters = {
		is_active: is_active => is_active == filter.active,
		property_for: property_for => property_for.find(x => filter.filter_for.includes(x)),
		rent: rent => rent <= filter.rent,
		price: price => price <= filter.price,
		beds_count: beds_count => beds_count <= filter.beds,
		baths_count: baths_count => baths_count <= filter.baths,
		rooms_count: rooms_count => rooms_count <= filter.rooms,
		msl: msl => msl.includes(filter.msl),
	};

	$: filtered = filter && filterArray(fetchedProperties, filters) || [];
	// $: console.log('>> ', filtered)

	function filterArray(array, filters) {
		const filterKeys = Object.keys(filters);
		return array.filter(item => {
			// validates all filter criteria
			return filterKeys.every(key => {
				if (typeof filters[key] !== 'function') return true; // ignores non-function predicates
				if (!filters[key].length) return true; // passing an empty filter means that filter is ignored.
				return filters[key](item[key]);
			});
		});
	}
</script>

<style>
	fieldset {
		border-radius: 9px;
		border: 1px dashed var(--color-black);
	}

	.deactivated { border: 1px solid var(--color-magenta); }

	.column {
		display: flex;
		flex-direction: column;
	}
	.wrap { flex-wrap: wrap; }

	.dates {
		display: flex;
		justify-content: space-between;
	}

	figure {
		display: inline-flex;
		flex-direction: column;
		margin: 0;
	}
	figure img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.land_use span {
		margin: 0 0.3rem;
		font-weight: bold;
		text-decoration: underline;
		font-size: 1.5rem;
	}

	details summary { cursor: pointer; }
	details > span {
		margin: 0.2rem;
		display: inline-block;
		padding: 0.2rem;
		border: 1px dotted;
		border-radius: 9px;
	}

.grid-container {
  display: grid;
	grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "filter" "list";
  /* grid-template-columns: 1.4fr 0.6fr; */
  /* grid-template-rows: 1fr; */
  /* grid-template-areas: "list filter"; */
}
@media (min-width: 768px) {
	.grid-container {
		grid-template-columns: 1.4fr 0.6fr;
		grid-template-rows: 1fr;
		grid-template-areas: "list filter";
	}
}

.properties_list {
	grid-area: list;
	/* background: lavender; */
	display: grid;
	grid-gap: 1rem;
	grid-template-columns: minmax(auto, 1fr);
	/* grid-template-columns: minmax(auto, 50%) minmax(auto, 50%); */
	padding: 0 1rem;
}
/* .properties_list.list {} */
@media (min-width: 1024px) {
	.properties_list {
		grid-template-columns: auto auto;
		padding: 6rem 1rem;
	}
	.properties_list.list {
		grid-template-columns: auto;
	}
}

.filter { grid-area: filter; }
.filter .filters-wrappers {
	position: sticky;
	top: 0px;
}
.filter .filters-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
}
.filter .filters-menu :global(a) { height: auto; }
</style>

<svelte:window on:keydown="{konami}"/>

<svelte:head>
	<title>List of Properties</title>
</svelte:head>

<Logo type="regular" color="bw" fixed="fixed" on:click="{() => goto('/')}" />

<div class="grid-container">
  <div class="properties_list {view_style}">
	{#each filtered as property (property.id)}
		<fieldset class:deactivated="{!property.is_active}">
			<legend>
				{#if $isAdmin}
					<Button href="property/{property.id}">Edit</Button>
				{/if}
				<Button href="/{property.id}">View</Button>
				[{property.msl}]
			</legend>

			<div class="land_use">
			{#each property.property_for as p_for}
				<span>{p_for}</span>
			{/each}
			</div>

			<div class="dates wrap">
				<small>added: {property.date_listed}</small>
				<small>updated: {property.date_updated}</small>
			</div>

			{#if property.photos}
			<figure>
				<img src="{property.photos[0]}" alt="{property.id} photo" loading="auto" width="111" height="62.44">
				<caption>{property.photos.length} images</caption>
			</figure>
			{/if}

			<!-- {#each Object.entries(property) as [key, value]}
				{key} - {value}
			{/each} -->

			<address class="column">
				{#if property.address}<span>{property.address}</span>{/if}
				<small>{property.location.lat} / {property.location.lng}</small>
				{#if property.contact_phone}<tel>{property.contact_phone}</tel>{/if}
				{#if property.contact_email}<email>{property.contact_email}</email>{/if}
			</address>

			<details class="column wrap">
				<summary>Details</summary>
				{#if property.id}<span>id: {property.id}</span>{/if}
				{#if property.land_use}<span>land use: {property.land_use}</span>{/if}
				{#if property.year_built}<span>year built: {property.year_built}</span>{/if}
				{#if property.baths_count}<span>baths: {property.baths_count}</span>{/if}
				{#if property.half_baths_count}<span>half baths: {property.half_baths_count}</span>{/if}
				{#if property.beds_count}<span>beds: {property.beds_count}</span>{/if}
				{#if property.rooms_count}<span>rooms: {property.rooms_count}</span>{/if}
				{#if property.parking_spaces}<span>parkings: {property.parking_spaces}</span>{/if}
				{#if property.lot_size}<span>lot size: {property.lot_size}</span>{/if}
				{#if property.building_size}<span>building size: {property.building_size}</span>{/if}
				{#if property.building_style}<span>building style: {property.building_style}</span>{/if}
				{#if property.price}<span>price: {property.price}</span>{/if}
				{#if property.rent}<span>rent: {property.rent}</span>{/if}
				{#if property.fees}<span>fees: {property.fees}</span>{/if}
				{#if property.taxes}<span>taxes: {property.taxes}</span>{/if}
			</details>

			{#if property.features}
			<details class="features">
				<summary>Features</summary>
				{#each property.features as feature}
				<span>{feature}</span>
				{/each}
			</details>
			{/if}

			{#if property.description}
			<details class="description">
				<summary>Description</summary>
				<p>{property.description}</p>
			</details>
			{/if}
		</fieldset>
	{/each}
	</div>

  <div class="filter">
		<div class="filters-wrappers">
			<div class="filters-menu">
				<div class="view_type">
					<label class="radio">
						<input type="radio" bind:group="{view_style}" value="grid" />
						<span>☷<!-- &#9783; --></span>
					</label>

					<label class="radio">
						<input type="radio" bind:group="{view_style}" value="list" />
						<span>☰<!-- &#9776; --></span>
					</label>
				</div>

				<h3>{filtered.length} / {fetchedProperties.length}</h3>

				{#if $isAdmin}
					<Button href="/property">Add new</Button>
				{/if}
			</div>

			<Filter bind:filter />
		</div>
	</div>
</div>
