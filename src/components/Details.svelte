<script>
	import { onDestroy, createEventDispatcher } from "svelte";
	import properties from "../properties-store.js";
	import Ad from "../components/UI/Ad.svelte";
	import Badge from "../components/UI/Badge.svelte";
	import Button from "../components/UI/Button.svelte";
	import Carousel from "../components/UI/Carousel.svelte";
	import Gravatar from "../components/UI/Gravatar.svelte";
	import StaticMap from "../components/Map/StaticMap.svelte";
	import { formatter, ago } from 'helpers.js';

	export let id;
	export let btn = true;

	let selectedProperty;

	const unsubscribe = properties.subscribe(items => {
		selectedProperty = items.find(i => i.id === id);
	});

	// $: console.log('Details: ', selectedProperty);

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
		/* background: #fffffffa; */
		background: var(--color-white);
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
		overflow: hidden;
		height: 50vh;
		/* height: max-content; */
	}

	.slide-content {
		flex: 1;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.side {
		grid-area: aside;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;
	}
	.side .map-group,
	.side .badge-group,
	.side .price-group {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
		margin: 1rem 0;
		width: 100%;
	}

	.side .features {
		margin: 2rem 0;
		text-align: center;
		width: 100%;
	}
	.side .feature {
		border: 1px dashed var(--color-light);
		padding: 0 0.2rem;
		margin: 0.1rem;
		border-radius: 6px;
		display: inline-block;
	}

	.side .description {
		max-height: 369px;
		overflow: auto;
		padding: 0 0.3rem;
		margin: 2rem 0;
		white-space: pre-wrap;
	}

	.side .ad-wrapper {
		display: flex;
		justify-content: center;
		flex: 1;
		align-items: center;
		width: 100%;
	}

	.realtor-group {
		display: flex;
		align-items: center;
		justify-content: center;
		/* background: linear-gradient(-45deg, #00000036, transparent); */
		width: 100%;
		/* border-radius: 50px var(--border-radius) var(--border-radius) 50px; */
		/* box-shadow: 6px 0px 6px #00000030; */
		margin: 1rem 0;
	}
	.realtor-group div {
		display: flex;
		flex-direction: column;
		margin: 1rem;
	}
	.realtor-group h3 {
		margin: 0;
	}
	.realtor-group a {
		color: var(--color-orange, dodgerblue);
		text-decoration: none;
		white-space: nowrap;
	}
	.realtor-group a:before {
		margin-right: 0.5em;
		color: var(--color-dark);
	}
	.realtor-group a[href^="mailto:"]:before { content: "\2709"; }
	.realtor-group a[href^="tel:"]:before { content: "\260e"; }


	/* BASE SECTION */
	.base {
		grid-area: base;
		display: grid;
		grid-template-columns: repeat(1, minmax(auto, 1fr));
		grid-gap: 1rem;
		align-items: center;
		padding: 1rem;
		background: var(--color-black);
		color: var(--color-white);
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='64' viewBox='0 0 32 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 28h20V16h-4v8H4V4h28v28h-4V8H8v12h4v-8h12v20H0v-4zm12 8h20v4H16v24H0v-4h12V36zm16 12h-4v12h8v4H20V44h12v12h-4v-8zM0 36h8v20H0v-4h4V40H0v-4z' fill='%23130825' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
	}

	.base .badge-group {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
	.side .badge-group :global(.badge),
	.base .badge-group :global(.badge),
	.side .price-group :global(.badge) { margin: 0.6rem; }

	@media (orientation: landscape) {
		#details :global(.close) { top: 83vh; }
		.image { height: 81vh; }
	}

	@media (min-width: 1024px) {
		#details {
			/* grid-template-columns: minmax(auto, 60vw) 1fr; */
			grid-template-columns: 1fr minmax(540px, min-content);
			grid-template-rows: repeat(2, 1fr);
			grid-template-areas:
				"main aside"
				"base aside";
		}
		#details :global(.close) { top: 10px; }
		.image { width: auto; height: 63vh; }
		.base {
			grid-template-columns: repeat(2, minmax(min-content, auto));
			grid-gap: 3rem;
			padding: 3rem;
		}
	}
</style>

<section id="details">

	<!-- IMAGE PANE -->
  <div class="image">
		<Carousel>
			{#if selectedProperty.photos}
				{#each selectedProperty.photos as photo}
				<!-- <div class="slide-content" style="background-image: url({photo})" /> -->
				<img class="slide-content" src="{photo}" alt="property" loading="lazy" />
				{/each}
			{:else}
				<img class="slide-content" src="/images/placeholder/1080x810.png" alt="property" loading="eager" />
				<!-- <div class="slide-content" style="background-image: url(/images/placeholder/1080x810.png)" /> -->
			{/if}
		</Carousel>
	</div>

	<!-- SIDE PANE -->
  <div class="side">
		<div class="badge-group">
			{#if selectedProperty.year_built}
				<Badge type="text" label="built" value="{selectedProperty.year_built} &bull; {ago(new Date(selectedProperty.year_built))}" />
			{/if}
			{#if selectedProperty.building_style}
				<Badge type="text" label="style" value="{selectedProperty.building_style}" />
			{/if}
		</div>

		<div class="badge-group">
			{#if selectedProperty.building_size > 0}
				<Badge type="text" label="building" value="{selectedProperty.building_size}㎡" />
			{/if}
			{#if selectedProperty.lot_size > 0}
				<Badge type="text" label="lot" value="{selectedProperty.lot_size}㎡" />
			{/if}
		</div>

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

		{#if selectedProperty.location.lat && selectedProperty.location.lng}
		<div class="map-group">
			<StaticMap lat="{selectedProperty.location.lat}" lon="{selectedProperty.location.lng}" zoom="15" marker="https://i.imgur.com/gA01omN.png" />
		</div>
		{/if}

		{#if selectedProperty.features}
		<div class="features">
			{#each selectedProperty.features as feature}
			<div class="feature">{feature}</div>
			{/each}
		</div>
		{/if}

		<div class="ad-wrapper">
			<Ad width="320" height="100" />
		</div>

		{#if selectedProperty.description}
		<div class="description scroller">
			{selectedProperty.description}
		</div>
		{/if}

		{#if btn}
		<Button type="button" mode="close" on:click={() => dispatch('close')}>X</Button>
		{/if}
	</div>

	<!-- BASE PANE -->
  <div class="base">
		{#if selectedProperty.contact_realtor}
		<div class="realtor-group">
			{#if selectedProperty.contact_email}
				<Gravatar email="{selectedProperty.contact_email}" type="round" size="90" base="mp" />
			{/if}
			<div>
				<h3>{selectedProperty.contact_realtor}</h3>
				{#if selectedProperty.contact_email}<span><a href="mailto:{selectedProperty.contact_email}" rel="nofollow">{selectedProperty.contact_email}</a></span>{/if}
				{#if selectedProperty.contact_phone}<span><a href="tel:{selectedProperty.contact_phone}" rel="nofollow">{selectedProperty.contact_phone}</a></span>{/if}
			</div>
		</div>
		{:else}
		<div class="badge-group">
			{#if selectedProperty.contact_email}<Badge type="text" label="email" value="{selectedProperty.contact_email}" />{/if}
			{#if selectedProperty.contact_phone}<Badge type="text" label="call" value="{selectedProperty.contact_phone}" />{/if}
		</div>
		{/if}

		<div class="badge-group">
			{#if selectedProperty.land_use}
				<Badge type="text" label="type" value="{selectedProperty.land_use}" />
			{/if}
			{#if selectedProperty.property_for}
				<Badge type="text" label="for" loop="{true}" value="{selectedProperty.property_for}" />
			{/if}

			<Badge type="text" label="msl" value="{selectedProperty.msl}" />
		</div>
	</div>
</section>
