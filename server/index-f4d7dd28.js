'use strict';

var api = require('./api-12e8b0c7.js');
require('./StaticMap-5e5df9cc.js');
require('./app-88572a1b.js');
require('./Toggle-d93cad25.js');
var _Editor = require('./_Editor-a99dbb0f.js');

/* src\routes\property\index.svelte generated by Svelte v3.12.1 */

const Index = api.create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let property = {
			is_active: true,
			msl: '',
			land_use: 'Residential',
			property_for: ['Sale'],
			year_built: '',
			building_style: '',
			building_size: '',
			lot_size: '',
			parking_spaces: '',
			rooms_count: '',
			beds_count: '',
			baths_count: '',
			half_baths_count: '',
			price: '',
			rent: '',
			taxes: '',
			fees: '',
			address: '',
			location: {
				lat: '',
				lng: ''
			},
			date_listed: new Date(),
			date_updated: new Date(),
			description: '',
			features: [],
			photos: [],
			contact_email: '',
			contact_phone: ''
	};

	return `${api.validate_component(_Editor.Editor, 'Editor').$$render($$result, { property: property }, {}, {})}`;
});

exports.default = Index;
