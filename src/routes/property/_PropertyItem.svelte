<script>
	import Button from '../../components/UI/Button.svelte';
	import {isAdmin, current, pattern, konami} from 'konami.js'; // to activate $isAdmin
	export let property;
</script>

<style>

.properties_list.grid > .property {
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content auto;
  grid-template-areas:
    "property-header"
    "property-image"
    "property-details";
	padding: 1rem 0 0;
}

/* PROPERTIES LIST -> PROPERTY */
.property {
  display: grid;
  grid-template-columns: min-content auto;
	grid-template-rows: auto 1fr;
  grid-template-areas: "property-header property-header"
											 "property-image property-details";
	position: relative;
  border: 1px solid var(--color-black);
  border-radius: 9px;
	margin: 1rem;
}

/* PROPERTIES LIST -> PROPERTY -> HEADER */
.property-header {
	grid-area: property-header;
	display: flex;
	flex-wrap: wrap;
	padding: 0.3rem;
}
.property-header .land_use span {
  font-size: 150%;
  margin: 0.3rem;
}
.property-header .dates {
  width: 100%;
  display: flex;
	flex-wrap: wrap;
  justify-content: space-between;
}

header {
	position: absolute;
	right: 1rem;
	top: -1.2rem;
	display: flex;
	background: white;
	align-items: center;
}
header span { margin: 0 1rem; }

/* PROPERTIES LIST -> PROPERTY -> IMAGE */
.property-image {
	grid-area: property-image;
	display: flex;
	flex-direction: column;
	margin: 0 0.3rem;
}
.property-image img { width: auto; }
@media (min-width: 768px) {
	.property-image img { width: 180px; height: auto; }
}
@media (min-width: 1024px) {
	.property-image img { width: 270px; height: auto; }
}

/* PROPERTIES LIST -> PROPERTY -> DETAILS */
.property-details {
	grid-area: property-details;
	padding: 0 0.6rem 0.6rem;
}
.property-details details summary { cursor: pointer; }
.property-details details > span {
		margin: 0.2rem;
		display: inline-block;
		padding: 0.2rem;
		border-radius: 9px;
		background: whitesmoke;
	}
</style>

<section class="property" class:deactivated="{!property.is_active}">
	<header>
		{#if $isAdmin}
			<Button href="property/{property.id}">Edit</Button>
		{/if}
		<Button href="/{property.id}">View</Button>
		<span>[{property.msl}]</span>
	</header>

	<div class="property-header">
		<div class="land_use">
			{#each property.property_for as p_for}
				<span>{p_for}</span>
			{/each}
		</div>

		<div class="dates wrap">
			<small>added: {property.date_listed}</small>
			<small>updated: {property.date_updated}</small>
		</div>
	</div>

	{#if property.photos}
	<figure class="property-image">
		<img src="{property.photos[0]}" alt="{property.id} photo" loading="auto" width="111" height="62.44">
		<caption>{property.photos.length} images</caption>
	</figure>
	{/if}

	<div class="property-details">
		<details class="column">
			<summary>Contacts</summary>
			{#if property.contact_phone}<span>{property.contact_phone}</span>{/if}
			{#if property.contact_email}<span>{property.contact_email}</span>{/if}
		</details>

		<details class="column">
			<summary>Location</summary>
			{#if property.address}<span>{property.address}</span>{/if}
			{#if property.location}<span>{property.location.lat} / {property.location.lng}</span>{/if}
		</details>

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
	</div>

</section>