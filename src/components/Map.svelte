<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '../components/UI/Button.svelte';

	export let properties;

	const dispatch = createEventDispatcher();
</script>

<style lang='scss'>
#properties {
	background: #242F3E;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	z-index: 1;
}
</style>

<!-- <pre>
{JSON.stringify(properties, null, 2)}
</pre> -->

<section id="properties">
	{#each properties as property (property.id)}
		<Button type="button" on:click={() => dispatch('showpreview', property.id)}>
			{property.msl} /
			{[property.location.lng, property.location.lat]} /
			{property.price} /
			{property.rent} /
			{property.land_use} /
			{property.property_for}
		</Button>
	{/each}
</section>