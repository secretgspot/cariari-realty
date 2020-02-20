<script>
	import { onMount } from 'svelte';
	export let lat = "9.9714";
	export let lon = "-84.1666";
	export let width = "300";
	export let height = "150";
	export let zoom = "15";
	export let pitch = '';
	export let bearing = '';
	export let marker = "https://www.mapbox.com/img/rocket.png";

	let isMounted = false;
	let baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';
	let apiKey = process.env.mapboxToken;

	onMount(() => isMounted = true); // hack to not trigger missing apiKey in image on first load

	$: imgSrc = `${baseUrl}/url-${encodeURIComponent(marker)}(${lon},${lat})/${lon},${lat},${zoom}/${width}x${height}?access_token=${apiKey}`;
</script>

<style>
	img { filter: brightness(var(--brightness)); }
</style>

{#if isMounted}
<img src="{imgSrc}" alt="static map for {lon}, {lat}" />
{/if}