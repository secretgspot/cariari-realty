// https://svelte.dev/repl/5505623bba0a49ad9d306f2b758faf4d?version=3.12.1
// not using updateFilter in filter.svelte yet it works. WHY?
import { writable } from 'svelte/store';

const filters = writable(
	{
		rent: 10000,
		price: 10000000,
		beds: 99,
		baths: 99,
		rooms: 99,
		filter_for: ['Rent','Sale', 'Investment'],
		active: true,
		msl: ''
	}
);

// create custom store
const customFiltersStore = {
	subscribe: filters.subscribe,
	setFilters: (filtersArray) => {
		filters.set(filtersArray);
	},
	updateFilter: (key, val) => {
		filters.update(v => { v[key] = val; return v });
	}
}

export default customFiltersStore;