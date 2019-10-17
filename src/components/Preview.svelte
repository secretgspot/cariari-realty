<script>
	import { createEventDispatcher } from 'svelte';
	import Badge from '../components/UI/Badge.svelte';
	import Button from '../components/UI/Button.svelte';
	import Ad from "../components/UI/Ad.svelte";
	import { formatter } from 'helpers.js';

	export let previewProperty;

	const dispatch = createEventDispatcher();

	// $: console.log('previewProperty: ', previewProperty.id);
</script>

<style>
	.preview-content {
		background: rgba(255, 255, 255, 0.9);
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
		margin: 2rem 0;
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}

	.preview-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-evenly;
		flex: 1;
	}

	footer {
		margin: 1rem;
		display: flex;
		justify-content: center;
	}

	@media (orientation: landscape) {
		figure { height: 72vh; }
	}

	@media (min-width: 768px) and (orientation: landscape) {
		/* .preview-content { max-width: 450px; } */
		figure { height: 45vh; }
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

		<div class="preview-group">
			{#if previewProperty.land_use}
				<Badge label="type" direction="row" value="{previewProperty.land_use}" />
			{/if}
			{#if previewProperty.property_for}
				<Badge label="for" direction="row" loop="{true}" value="{previewProperty.property_for}" />
			{/if}
			<!-- {#if previewProperty.building_style}
				<Badge label="style" direction="row" value="{previewProperty.building_style}" />
			{/if} -->
			{#if previewProperty.price > 0}
				<Badge label="price" direction="row" value="{formatter.format(previewProperty.price)}" />
			{/if}
			{#if previewProperty.rent > 0}
				<Badge label="rent" direction="row" value="{formatter.format(previewProperty.rent)}" />
			{/if}
		</div>

		<!-- <pre>
		{JSON.stringify(previewProperty, null, 2)}
		</pre> -->
		<Ad width="320" height="100" />
	</div>


	<footer>
		<Button type="button" on:click={() => dispatch('showdetails', previewProperty.id)}>
			Show Details
		</Button>
	</footer>
</section>
