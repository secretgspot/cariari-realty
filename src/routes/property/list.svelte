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
	import PropertyItem from './_PropertyItem.svelte';
	import {isAdmin, current, pattern, konami} from 'konami.js'; // to activate $isAdmin

	export let fetchedProperties;
	// console.log('>>> ', fetchedProperties);
	let filter;
	let view_style = 'grid';

	const filters = {
		is_active: is_active => is_active == filter.active,
		land_use: land_use => land_use == filter.filter_type,
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
/*
	GENERAL GRID
 */
.grid-container {
  display: grid;
	grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "filter" "list";
}
@media (min-width: 768px) {
	.grid-container {
		grid-template-columns: auto min-content;
		grid-template-rows: 1fr;
		grid-template-areas: "list filter";
		min-height: 100vh;
	}
}
.grid-container :global(a) { height: auto; }


/*
	PROPERTIES LIST SECTION
 */
.properties_list {
	grid-area: list;
	display: grid;
	grid-template-columns: minmax(min-content, auto);
	grid-template-rows: max-content;
	grid-auto-flow: dense;
	grid-gap: 1rem;
	background: var(--color-light, whitesmoke);
	padding: 3rem 0;
	/* justify-content: center; */
	/* align-items: baseline; */
}
@media (min-width: 768px) {
	/* .properties_list { padding: 3rem 0; } */
	.properties_list.grid {
		grid-template-columns: repeat(auto-fit, minmax(min-content, 252px));
	}
}
@media (min-width: 1024px) {
	.properties_list.grid {
		grid-template-columns: repeat(auto-fit, minmax(min-content, 313px));
	}
}


/*
	NOTHING TO SEE LIST SECTION
 */
.nothing_to_see {
	display: flex;
	flex-direction: column;
  justify-content: center;
	align-items: center;
	background: var(--color-light);
}
.nothing_to_see img { max-width: 63%; }


/*
	FILTER SECTION
 */
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
	margin: 0 2rem;
}
.filter .view_type { display: none; }
@media (min-width: 720px) {
	.filter .view_type { display: flex; }
}
.filter .view_type label {
  border: 1px solid var(--color-black);
  padding: 0.5rem 1rem;
  color: var(--color-black);
  border-radius: 9px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
  cursor: pointer;
}

.filter .view_type label:not(:first-of-type) {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
.filter .view_type label:not(:last-of-type) {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}
.filter .view_type input[type="radio"] { display: none; }
.filter .view_type input[type="radio"]:checked + label { border: 1px solid var(--color-success); }
</style>

<svelte:window on:keydown="{konami}"/>

<svelte:head>
	<title>List of Properties</title>
</svelte:head>

<Logo type="regular" color="bw" fixed="fixed" on:click="{() => goto('/')}" />

<div class="grid-container">
	{#if filtered.length > 0}
		<div class="properties_list {view_style}">
			{#each filtered as property (property.id)}
				<PropertyItem {property} />
			{/each}
		</div>
	{:else}
		<div class="nothing_to_see">
			<img src="/images/placeholder/empty_list.svg" alt="empty list image" />
			<p >Nothing to see</p>
		</div>
	{/if}

  <div class="filter">
		<div class="filters-wrappers">
			<div class="filters-menu">
				<div class="view_type">
					<input type="radio" id="radio_grid" bind:group="{view_style}" value="grid" />
					<label class="radio radio_grid" for="radio_grid"><span>☷<!-- &#9783; --></span></label>

					<input type="radio" id="radio_list" bind:group="{view_style}" value="list" />
					<label class="radio radio_list" for="radio_list"><span>☰<!-- &#9776; --></span></label>
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
