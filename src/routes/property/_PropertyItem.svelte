<script>
	import Button from '../../components/UI/Button.svelte';
	import {isAdmin, current, pattern, konami} from 'konami.js'; // to activate $isAdmin
	export let property;
</script>

<style>

.properties_list.grid > .property {
  grid-template-columns: 1fr;
  grid-template-rows: min-content minmax(180px, auto) auto min-content;
  grid-template-areas:
    "property-header"
    "property-image"
		"property-details"
		"property-footer";
	padding: 1rem 0 0;
}
.properties_list.grid > .property .property-details { padding: 1rem; }

/* PROPERTIES LIST -> PROPERTY */
.property {
  display: grid;
  grid-template-columns: 1fr 1fr;
	grid-template-rows: auto 1fr auto;
  grid-template-areas: "property-header property-header"
											 "property-image property-details"
											 "property-footer property-footer";
	position: relative;
  border: 0px solid var(--color-black);
  border-radius: 9px;
	margin: 1rem;
	background: var(--color-white, white);
  box-shadow: 0 3px 6px 0 hsla(0, 0%, 0%, 0.2);
}
@media (min-width: 1024px) {
	.property {
  	grid-template-areas: "property-image property-header"
												 "property-image property-details"
												 "property-image property-footer";
	}
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
	color: var(--color-dark);
	padding: 0.3rem;
}


/* PROPERTIES LIST -> PROPERTY -> IMAGE */
.property-image {
	grid-area: property-image;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0;
	position: relative;
	background-size: cover;
}
/* .property-image img { width: auto; } */
/* .property-image caption { display: none; } */
@media (min-width: 768px) {
	/* .property-image img { width: 208px; height: auto; } */
}
@media (min-width: 1024px) {
	.properties_list:not(.grid) > .property .property-image { border-radius: 9px 0 0 9px; }
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

/* PROPERTIES LIST -> PROPERTY -> FOOTER */
.property-footer {
	grid-area: property-footer;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 1rem;
	background: var(--color-light);
	box-shadow: 0 3px 6px 0 hsla(0, 0%, 0%, 0.2);
	border-bottom-left-radius: 9px;
	border-bottom-right-radius: 9px;
}
.property-footer span { margin-left: auto; }
.property-footer :global(a) {
	flex: 0 1 auto;
}
</style>

<section class="property" class:deactivated="{!property.is_active}">
	<footer class="property-footer">
		{#if $isAdmin}
			<Button href="property/{property.id}">Edit</Button>
		{/if}
		<Button href="/{property.id}">View</Button>
		<span>[{property.msl}]</span>
	</footer>

	<div class="property-header">
		<div class="land_use">
			{#each property.property_for as p_for}
				<span>{p_for}</span>
			{/each}
		</div>

		<div class="dates wrap">
			<span>added: {new Date(property.date_listed).toLocaleDateString("en-US")}</span>
			<span>updated: {new Date(property.date_updated).toLocaleDateString("en-US")}</span>
		</div>
	</div>

	{#if property.photos}
	<figure class="property-image" style="background-image: url({property.photos[0]})">
		<!-- <img src="{property.photos[0]}" alt="{property.id} photo" loading="auto" width="111" height="62.44"> -->
		<!-- <caption>{property.photos.length} images</caption> -->
	</figure>
	{/if}

	<div class="property-details">
		<details class="column" open>
			<summary>Contacts</summary>
			{#if property.contact_phone}<span>{property.contact_phone}</span>{/if}
			{#if property.contact_email}<span>{property.contact_email}</span>{/if}
		</details>

		<details class="column" open>
			<summary>Location</summary>
			{#if property.address}<span>{property.address}</span>{/if}
			{#if property.location}<span>{property.location.lat} / {property.location.lng}</span>{/if}
		</details>

		<details class="column wrap" open>
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
		<details class="features" open>
			<summary>Features</summary>
			{#each property.features as feature}
			<span>{feature}</span>
			{/each}
		</details>
		{/if}

		<!-- {#if property.description}
		<details class="description">
			<summary>Description</summary>
			<p>{property.description}</p>
		</details>
		{/if} -->
	</div>

</section>