<script context="module">
	import * as api from 'api.js';

	export async function preload({ params, query }) {
		const { slug } = params;
		const property = await api.get(`cariari/${slug}.json`, null);

		return { property, slug, query };
	}
</script>

<script>
	import { goto } from '@sapper/app';
	import LogoSvg from "../components/UI/LogoSvg.svelte";
	import properties from "../properties-store.js";
	import Details from '../components/Details.svelte';

	export let slug;
	export let query;
	export let property;

	// console.log('#######>##: ', $properties);
	// property = {...property, id: slug};

	properties.addProperty({...property, id: slug});

	// $: console.log('[properities]>>> ',  $properties);
	// $: console.log('[property]>>> ',  slug, query, property);
</script>

<style>

</style>

<!-- {property} {slug} {query}
<pre>
{JSON.stringify(property, null, 2)}
{JSON.stringify(query, null, 2)}
{JSON.stringify($properties, null, 2)}
</pre> -->

<svelte:head>
	<title>{property.msl}</title>
</svelte:head>

<!-- <Logo type="coin" color="gold" fixed="fixed" on:click="{() => goto('/')}" /> -->
<LogoSvg animate="{true}" style="gold" fixed="fixed" on:click="{() => goto('/')}" />

<Details id="{slug}" btn="{false}" />