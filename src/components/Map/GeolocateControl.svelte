<script>
	import { getContext } from 'svelte';
	import { contextKey } from './mapbox.js';

	const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
	const mapbox = getMapbox();

  export let position = 'bottom-left';
  export let options = {
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true
	};

  const geolocate = new mapbox.GeolocateControl(options);
  map.addControl(geolocate, position);
</script>