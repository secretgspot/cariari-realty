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
		return { fetchedProperties: loadedProperties };
	}
</script>

<script>
	import Button from "../components/UI/Button.svelte";
	import Filter from "../components/UI/Filter.svelte";

	export let fetchedProperties;
	// console.log('>>> ', fetchedProperties);
	let filter;

	const filters = {
		property_for: property_for => property_for.find(x => filter.filter_for.includes(x)),
		rent: rent => rent <= filter.rent,
		price: price => price <= filter.price,
		beds_count: beds_count => beds_count <= filter.beds,
		baths_count: baths_count => baths_count <= filter.baths,
		rooms_count: rooms_count => rooms_count <= filter.rooms,
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
	.deactivated {
		border: 1px solid var(--color-magenta);
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.wrap { flex-wrap: wrap; }
	figure {
		display: inline-flex;
		flex-direction: column;
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
	}

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
  grid-template-rows: auto auto 1fr;
  grid-template-areas: "filter" "header" "list";
  /* grid-template-columns: 1.4fr 0.6fr; */
  /* grid-template-rows: 1fr; */
  /* grid-template-areas: "list filter"; */
}
@media (min-width: 768px) {
	.grid-container {
		grid-template-columns: 1.4fr 0.6fr;
		grid-template-rows: 1fr;
		grid-template-areas: "header ." "list filter";
	}
}
.header { grid-area: header; padding: 0 2rem; }

.list {
	grid-area: list;
	/* background: lavender; */
	display: grid;
	grid-gap: 1rem;
	grid-template-columns: minmax(auto, 1fr);
	/* grid-template-columns: minmax(auto, 50%) minmax(auto, 50%); */
	padding: 1rem;
}
@media (min-width: 1024px) {
.list {
	grid-template-columns: auto auto;
}
}

.filter { grid-area: filter; }
</style>

<div class="grid-container">
	<div class="header">
		<h1>{filtered.length} / {fetchedProperties.length} properties</h1>
	</div>

  <div class="list">
	{#each filtered as property (property.id)}
		<fieldset class:deactivated="{!property.is_active}">
			<legend>[{property.msl}] {property.id} <Button href="property/{property.id}">Edit</Button></legend>

			<div class="land_use">
			{#each property.property_for as p_for}
				<span>{p_for}</span>
			{/each}
			</div>

			<div class="dates column">
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
				<span>{property.address}</span>
				<small>{property.location.lat} / {property.location.lng}</small>
				<tel>{property.contact_phone}</tel>
				<email>{property.contact_email}</email>
			</address>

			<details class="column wrap">
				<summary>Details</summary>
				<span>land use: {property.land_use}</span>
				<span>year built: {property.year_built}</span>
				<span>baths: {property.baths_count}</span>
				<span>half baths: {property.half_baths_count}</span>
				<span>beds: {property.beds_count}</span>
				<span>rooms: {property.rooms_count}</span>
				<span>parkings: {property.parking_spaces}</span>
				<span>lot size: {property.lot_size}</span>
				<span>building size: {property.building_size}</span>
				<span>building style: {property.building_style}</span>
				<span>price: {property.price}</span>
				<span>rent: {property.rent}</span>
				<span>fees: {property.fees}</span>
				<span>taxes: {property.taxes}</span>
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
		<Filter bind:filter />
	</div>
</div>
