<script>
	import { getContext } from 'svelte';
	import { contextKey } from './mapbox.js';

	const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
	const mapbox = getMapbox();

  export let position = 'bottom-left';
  export let options = {};

  const nav = new mapbox.NavigationControl({
    ...options
	});

  map.addControl(nav, position);
</script>
