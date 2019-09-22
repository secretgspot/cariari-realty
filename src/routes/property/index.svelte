<script>
	import Editor from './_Editor.svelte';

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
</script>

<Editor {property} />

