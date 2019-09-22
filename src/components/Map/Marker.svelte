<script>
	import { createEventDispatcher } from 'svelte';
	import { getContext } from 'svelte';
	import { contextKey } from './mapbox.js';

	const dispatch = createEventDispatcher();
	const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
	const mapbox = getMapbox();

	export let lat;
	export let lon;
	export let label;
	export let property;

	function createColor(property) {
		let scaffold = {
			sale: false,
			rent: false,
			investment: false
		}
		for (let item of property.property_for) {
			scaffold[item.toLowerCase()] = true;
		}
		return `#${scaffold.sale ? 'ff' : '00'}${scaffold.rent ? 'ff' : '00'}${scaffold.investment ? 'ff' : '00'}`;
	}

		// Override internal functionality
		mapbox.Marker.prototype.onClick = function(handleClick) {
			this._handleClick = handleClick;
			return this;
		};
		mapbox.Marker.prototype._onMapClick = function(t) {
			const targetElement = t.originalEvent.target;
			const element = this._element;

			if (this._handleClick && (targetElement === element || element.contains((targetElement)))) {
				this.togglePopup();
				this._handleClick();
			}
		};

	const popup = new mapbox.Popup({ offset: 25 }).setText(property.msl);
	const marker = new mapbox.Marker({ color: createColor(property) })
		.setLngLat([lon, lat])
		.setPopup(popup)
		.onClick(() => { dispatch('showpreview', property.id); map.setCenter([lon, lat]); })
		.addTo(map);
</script>