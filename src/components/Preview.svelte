<script>
	import { createEventDispatcher } from 'svelte';
	import Badge from '../components/UI/Badge.svelte';
	import Button from '../components/UI/Button.svelte';
	import Ad from "../components/UI/Ad.svelte";
	import { formatter, ago } from 'helpers.js';

	export let previewProperty;

	const dispatch = createEventDispatcher();

	// $: console.log('previewProperty: ', previewProperty.id);
</script>

<style>
	.preview-content {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.81), rgba(255, 255, 255, 0.9));
		position: relative;
		/* width: 450px; */
		z-index: 2;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	figure {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 42vh;
		position: relative;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.content {
		/* margin: 1rem; */
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.badge-group {
		padding: 2rem 0;
		display: flex;
		justify-content: space-evenly;
		width: 100%;
		/* box-shadow: inset 0px 1px 0px hsl(0, 0%, 100%),
								inset 0px 2px 0px #00000045; */
	}

	.preview-group {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 100%;
		padding: 2rem 3rem 0rem;
	}
	.preview-group .land_use {
		display: flex;
		justify-content: space-between;
	}
	.preview-group .type_age {
		text-transform: uppercase;
		color: var(--color-darker);
	}
	.preview-group .price_rent {
		font-size: 1.8em;
		display: flex;
		justify-content: space-between;
		margin: 0.3rem 0;
	}
	/* .preview-group .loc_address {
		font-size: smaller;
		display: flex;
		flex-direction: column;
		color: var(--color-dark);
	} */

	.ad-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	footer {
		margin: 2rem 1rem 1rem;
		display: flex;
		justify-content: center;
	}

	@media (orientation: landscape) {
		figure { height: 72vh; }
	}

	@media (min-width: 768px) and (orientation: landscape) {
		/* .preview-content { max-width: 450px; } */
		figure { height: 45vh; }
		.preview-group { padding: 2rem 5rem 1rem; }
	}
</style>

<section class="preview-content">
	<figure>
		{#if previewProperty.photos}
			<img class="image" src="{previewProperty.photos[0]}" alt="{previewProperty.msl}" loading="eager">
		{:else}
			<img class="image" src="/images/placeholder/450x360.png" alt="Property placeholder" loading="eager">
		{/if}
	</figure>

	<div class="content">
		<div class="preview-group">
			<div class="land_use">
				{#each previewProperty.property_for as p_for}
					<span>{p_for}</span>
				{/each}
			</div>

			<div class="price_rent">
				{#if previewProperty.rent}<span>{formatter.format(previewProperty.rent)}/m</span>{/if}
				{#if previewProperty.price}<span>{formatter.format(previewProperty.price)}</span>{/if}
			</div>

			<div class="type_age">
				{#if previewProperty.land_use}<span>{previewProperty.land_use}</span>{/if}
				{#if previewProperty.building_style}<span>&bull; {previewProperty.building_style}</span>{/if}
				{#if previewProperty.year_built}<span>&bull; {ago(new Date(previewProperty.year_built))} old</span>{/if}
			</div>

			<!-- <div class="loc_address">
				{#if previewProperty.location}<span>{previewProperty.location.lat} / {previewProperty.location.lng}</span>{/if}
			</div> -->
		</div>

		<div class="badge-group">
			{#if previewProperty.rooms_count > 0}
				<Badge type="icon" label="rooms" value="{previewProperty.rooms_count}" />
			{/if}
			{#if previewProperty.beds_count > 0}
				<Badge type="icon" label="beds" value="{previewProperty.beds_count}" />
			{/if}
			{#if previewProperty.baths_count > 0}
				<Badge type="icon" label="baths" value="{previewProperty.baths_count}" />
			{/if}
			{#if previewProperty.half_baths_count > 0}
				<Badge type="icon" label="half baths" value="{previewProperty.half_baths_count}" />
			{/if}
			{#if previewProperty.parking_spaces > 0}
				<Badge type="icon" label="parkings" value="{previewProperty.parking_spaces}" />
			{/if}
		</div>
	</div>

	<div class="ad-wrapper">
		<Ad width="320" height="100" />
	</div>

	<footer>
		<Button type="button" on:click={() => dispatch('showdetails', previewProperty.id)}>
			Show Details
		</Button>
	</footer>
</section>
