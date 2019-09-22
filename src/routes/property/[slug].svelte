<script context="module">
	import * as api from 'api.js';

	export async function preload({ params, query }) {
		const { slug } = params;
		const property = await api.get(`cariari/${slug}.json`, null);

		return { property, slug, query };
	}
</script>

<script>
	// import properties from "../../components/stores/properties-store.js";
	import Editor from './_Editor.svelte';
	import Print from './_Print.svelte';

	export let slug;
	export let query;
	export let property;

	// $: console.log('[slug]>>> slug, query, property: ',  slug, query, property);
</script>

<style>

</style>

{#if query.qr}
	<Print {property} {slug} {query} />
{:else}
	<Editor {property} {slug} {query} />
{/if}