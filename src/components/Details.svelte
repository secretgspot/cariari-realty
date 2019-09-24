<script>
	import { onDestroy, createEventDispatcher } from "svelte";
	import properties from "../properties-store.js";
	import Ad from "../components/UI/Ad.svelte";
	import Badge from "../components/UI/Badge.svelte";
	import Button from "../components/UI/Button.svelte";
	import Carousel from "../components/UI/Carousel.svelte";
	import { formatter } from 'helpers.js';

	export let id;

	let selectedProperty;

	const unsubscribe = properties.subscribe(items => {
		selectedProperty = items.find(i => i.id === id);
	});

	$: console.log('Details: ', selectedProperty);

	const dispatch = createEventDispatcher();

	onDestroy(() => {
		unsubscribe(); // done this way in case data will change live from server
	});

</script>

<style>
	#details {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(3, 1fr);
		grid-template-areas:
			"main"
			"aside"
			"base";
		position: fixed;
		top: 0; bottom: 0; left: 0; right: 0;
		width: 100vw; height: 100vh;
		background: #fffffffa;
		overflow: auto;
		z-index: 3;
	}

	#details :global(.close) {
		top: 51vh;
		width: 45px;
		height: 45px;
	}

	.image {
		grid-area: main;
		width: 100vw;
	}

	.slide-content {
		flex: 1;
		background-size: cover;
		height: 50vh;
	}

	.side {
		grid-area: aside;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;
	}

	.side .features {
		margin: 2rem 0;
	}
	.side .feature {
		border: 1px dashed lavender;
		padding: 0 0.2rem;
		margin: 0.1rem;
		border-radius: 6px;
		display: inline-block;
	}

	.side .description {
		max-height: 336px;
		overflow: auto;
	}

	/* BASE SECTION */
	.base {
		grid-area: base;
		display: grid;
		grid-template-columns: repeat(1, minmax(auto, 1fr));
		grid-gap: 1rem;
		align-items: center;
		padding: 1rem;
	}

	.base .badge-group,
	.base .price-group {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
	.side .badge-group :global(.badge),
	.base .badge-group :global(.badge),
	.base .price-group :global(.badge) { margin: 0.6rem; }

	@media (orientation: landscape) {
		#details :global(.close) { top: 83vh; }
		.slide-content {
			height: 81vh;
			background-repeat: no-repeat;
			background-position: center;
		}
	}

	@media (min-width: 1024px) {
		#details {
			grid-template-columns: minmax(auto, 60vw) 1fr;
			grid-template-rows: repeat(2, 1fr);
			grid-template-areas:
				"main aside"
				"base aside";
		}
		#details :global(.close) { top: 10px; }
		.image { width: auto; }
		.slide-content { height: 72vh; }
		.base { grid-template-columns: repeat(3, minmax(auto, 1fr)); }
	}
</style>

<section id="details">

	<!-- IMAGE PANE -->
  <div class="image">
		<Carousel>
			{#if selectedProperty.photos}
				{#each selectedProperty.photos as photo}
				<div class="slide-content" style="background-image: url({photo})" />
				{/each}
			{:else}
				<div class="slide-content" style="background-image: url(/images/placeholder/1080x810.png)" />
			{/if}
		</Carousel>

		<!-- <pre>
		{JSON.stringify(selectedProperty.photos, null, 2)}
		</pre> -->
	</div>

	<!-- SIDE PANE -->
  <div class="side">

		<div class="badge-group">
			{#if selectedProperty.land_use}
				<Badge type="text" label="type" value="{selectedProperty.land_use}" />
			{/if}
			{#if selectedProperty.property_for}
				<Badge type="text" label="for" loop="{true}" value="{selectedProperty.property_for}" />
			{/if}
		</div>

		<div class="badge-group">
			{#if selectedProperty.year_built}
				<Badge type="text" label="built" value="{selectedProperty.year_built}" />
			{/if}
			{#if selectedProperty.building_style}
				<Badge type="text" label="style" value="{selectedProperty.building_style}" />
			{/if}

			{#if selectedProperty.building_size > 0}
				<Badge type="text" label="building" value="{selectedProperty.building_size}㎡" />
			{/if}
			{#if selectedProperty.lot_size > 0}
				<Badge type="text" label="lot" value="{selectedProperty.lot_size}㎡" />
			{/if}
		</div>

		{#if selectedProperty.features}
		<div class="features">
			{#each selectedProperty.features as feature}
			<div class="feature">{feature}</div>
			{/each}
		</div>
		{/if}

		<Ad width="336" height="280" />

		{#if selectedProperty.description}
		<div class="description">
			{selectedProperty.description}
		</div>
		{/if}

		<Button type="button" mode="close" on:click={() => dispatch('close')}>X</Button>
	</div>

	<!-- BASE PANE -->
  <div class="base">
		<Badge type="text" label="msl" value="{selectedProperty.msl}" />

		<div class="badge-group">
			{#if selectedProperty.rooms_count > 0}
				<Badge type="icon" label="rooms" value="{selectedProperty.rooms_count}" />
			{/if}
			{#if selectedProperty.beds_count > 0}
				<Badge type="icon" label="beds" value="{selectedProperty.beds_count}" />
			{/if}
			{#if selectedProperty.baths_count > 0}
				<Badge type="icon" label="baths" value="{selectedProperty.baths_count}" />
			{/if}
			{#if selectedProperty.half_baths_count > 0}
				<Badge type="icon" label="half baths" value="{selectedProperty.half_baths_count}" />
			{/if}
			{#if selectedProperty.parking_spaces > 0}
				<Badge type="icon" label="parkings" value="{selectedProperty.parking_spaces}" />
			{/if}
		</div>

		<div class="price-group">
			{#if selectedProperty.price > 0}
				<Badge type="text" label="price" value="{formatter.format(selectedProperty.price)}" />
			{/if}
			{#if selectedProperty.rent > 0}
				<Badge type="text" label="rent" value="{formatter.format(selectedProperty.rent)}" />
			{/if}
			{#if selectedProperty.taxes > 0}
				<Badge type="text" label="taxes" value="{formatter.format(selectedProperty.taxes)}" />
			{/if}
			{#if selectedProperty.fees > 0}
				<Badge type="text" label="condo fees" value="{formatter.format(selectedProperty.fees)}" />
			{/if}
		</div>
	</div>

</section>