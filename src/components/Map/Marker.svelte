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
		const propClasses = {
			'000': '#242F3E', // none
			'001': '#FF00F7', // investment (magenta)
			'010': '#FFC400', // rent (orange)
			'100': '#00E5FF', // sale (cyan)
			'011': '#FF0056', // investment + rent (burdengy)
			'101': '#8077D5', // investment + sale (purple)
			'110': '#80ED80',  // rent + sale (green)
			'111': '#FFFFFF' // investment + rent + sale (white)
		};
		const scaffold = {
			sale: false,
			rent: false,
			investment: false
		}
		for (let item of property.property_for) {
			scaffold[item.toLowerCase()] = true;
		}
		// return `#${scaffold.sale ? 'ff' : '00'}${scaffold.rent ? 'ff' : '00'}${scaffold.investment ? 'ff' : '00'}`; // old way
		return propClasses[`${Number(scaffold.sale)}${Number(scaffold.rent)}${Number(scaffold.investment)}`];
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
		.onClick(() => {
				dispatch('showpreview', property.id);
				//map.setCenter([lon, lat]);
			})
		.addTo(map);
</script>