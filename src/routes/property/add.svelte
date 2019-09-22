<script>
	import { createEventDispatcher } from "svelte";
	import properties from '../../properties-store.js';
	import TextInput from '../../components/UI/TextInput.svelte';
	import Button from '../../components/UI/Button.svelte';
	import Toggle from '../../components/UI/Toggle.svelte';
	import { isEmpty, isNumber, isValidPhone, isValidEmail } from 'validation.js';

	let is_active = true; // show on map or not
	let msl = ''; // CR-123 listing identifier
	let land_use = 'Residential'; // residential / commercial / industrial
	let property_for = ['Sale']; // rent / sale / investment
	let year_built = null; // 1990
	let building_style = ''; // 2 Story
	let building_size = null; // 460 sq/m
	let lot_size = null;  // 720 sq/m
	let parking_spaces = null; // 6
	let rooms_count = null; // 3
	let beds_count = null; // 3
	let baths_count = null; // 3
	let half_baths_count = null; // 3
	let price = null; // $23,000,000
	let rent = null; // $13,000
	let taxes = null; // $10,000
	let fees = null; // $999 / year | month
	let address = ''; // address (optional)
	let latitude = ''; // 9.968647
	let longitude = ''; // -84.16497213
	let date_listed = new Date(); // Date submitted
	let date_updated = new Date(); // Date updated
	let description = ''; // Description, limited at 666 words
	let features = ''; // list of features i.e. car port, security, pool, cable, alarm
	let photos = ''; // array of images
	let contact_email = ''; // property email (optional)
	let contact_phone = ''; // property phone (optional)

	let formIsValid = false;

	$: descriptionValid = !isEmpty(description);
	$: formIsValid =
			!isEmpty(msl) &&
			!isEmpty(latitude) &&
			!isEmpty(longitude);
			// isNumber(year_built) &&
			// isValidEmail(contact_email) &&
			// descriptionValid;

	$: console.log({
			is_active: is_active,
			msl: msl,
			land_use: land_use,
			property_for: property_for,
			year_built: year_built,
			building_style: building_style,
			building_size: building_size,
			lot_size: lot_size,
			parking_spaces: parking_spaces,
			rooms_count: rooms_count,
			beds_count: beds_count,
			baths_count: baths_count,
			half_baths_count: half_baths_count,
			price: price,
			rent: rent,
			taxes: taxes,
			fees: fees,
			address: address,
			location: {
				lat: latitude,
				lng: longitude
			},
			date_listed: date_listed,
			date_updated: date_updated,
			description: description,
			features: features.split(', '),
			photos: photos.split(', '), // TODO: FIX THIS!!!
			email: contact_email,
			phone: contact_phone
		});

	const dispatch = createEventDispatcher();

	function submitForm () {
		const propertyData = {
			is_active: is_active,
			msl: msl,
			land_use: land_use,
			property_for: property_for,
			year_built: year_built,
			building_style: building_style,
			building_size: building_size,
			lot_size: lot_size,
			parking_spaces: parking_spaces,
			rooms_count: rooms_count,
			beds_count: beds_count,
			baths_count: baths_count,
			half_baths_count: half_baths_count,
			price: price,
			rent: rent,
			taxes: taxes,
			fees: fees,
			address: address,
			location: {
				lat: latitude,
				lng: longitude
			},
			date_listed: date_listed,
			date_updated: date_updated,
			description: description,
			features: features.split(', '),
			photos: photos.split(', '), // TODO: FIX THIS!!!
			email: contact_email,
			phone: contact_phone

		};

		// fetch POST data with firebase with new cariari.json db
		fetch('https://svelte-meetups-course.firebaseio.com/cariari.json', {
			method: 'POST',
			body: JSON.stringify(propertyData),
			header: { 'Content-Type': 'application/json' }
		})
			.then(res => {
				if (!res.ok) {
					throw new Error('Firebase POST error occurred to add new property, try again!');
				}
				return res.json();
			})
			.then(data => {
				console.dir(data); // { name: '-LoTWYOzqSI6lo6xQlHa' }
				// add to store
				properties.addProperty({...propertyData, id: data.name});
				//console.log('would push this data to store ', {...propertyData, id: data.name});
			})
			.catch(err => {
				console.log(err);
			});

		dispatch('save'); // dispatch save event if any other UI needs it.
	}

	function getPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				console.log('position> ', position);
			}, function() {
				console.log('FAILED TO GET POSITION');
			}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
		} else {
			// Browser doesn't support Geolocation
			console.log('YOUR BROWSER DOESN"T SUPPORT NAVIGATION');
		}
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<style>
	#add {
		grid-column: 3 / 9;
	}
	form {
		display: flex;
		flex-wrap: wrap;
	}

	.select-css {
		display: block;
		font-size: 16px;
		padding: .6em 1.4em .5em .8em;
		margin: 2rem 0;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
	}
	.select-css::-ms-expand {
		display: none;
	}
	.select-css:hover {
		border-color: #888;
	}
	.select-css:focus {
		border-color: #aaa;
		color: #222;
		outline: none;
	}
	.select-css option {
		font-weight: normal;
	}

</style>

<svelte:head>
	<title>Add new Property</title>
</svelte:head>


<section id="add">

	<h1>Add new Property</h1>

	<form on:submit|preventDefault="{submitForm}">


		<!-- LAND USE -->
		<fieldset class="inputs-group">
			<legend>Land Use</legend>

			<Toggle bind:checked={is_active} label="Listed" />

			<TextInput
				id="msl"
				label="MSL"
				valid={!isEmpty(msl)}
				validityMessage="identifier ex: CR-000"
				value={msl}
				on:input={event => (msl = event.target.value)} />

			<select class="select-css" bind:value={land_use}>
				<option>Residential</option>
				<option>Commercial</option>
				<option>Industrial</option>
			</select>

			<fieldset>
				<legend>Property For</legend>
				<label>
					<input type="checkbox" bind:group="{property_for}" value="Rent">	Rent
				</label>
				<label>
					<input type="checkbox" bind:group="{property_for}" value="Sale">	Sale
				</label>
				<label>
					<input type="checkbox" bind:group="{property_for}" value="Investment">	Investment
				</label>
			</fieldset>
		</fieldset>

		<!-- PARCEL DETAILS -->
		<fieldset class="inputs-group">
			<legend>Parcel Details</legend>

			<TextInput
				type="number"
				id="built"
				label="Year Built"
				valid={isNumber(year_built)}
				validityMessage="Built Year ex: 2000"
				value={year_built}
				on:input={event => (year_built = event.target.value)} />

			<TextInput
				id="style"
				label="Style"
				valid={!isEmpty(building_style)}
				validityMessage="Building Style ex: 2 Story"
				value={building_style}
				on:input={event => (building_style = event.target.value)} />

			<TextInput
				id="buildingArea"
				label="Building Area"
				valid={isNumber(building_size)}
				validityMessage="Building in ㎡, ex: 630"
				value={building_size}
				on:input={event => (building_size = event.target.value)} />

			<TextInput
				id="lotArea"
				label="Lot Area"
				valid={isNumber(lot_size)}
				validityMessage="Lot in ㎡, ex: 900"
				value={lot_size}
				on:input={event => (lot_size = event.target.value)} />
		</fieldset>

		<!-- BUILDING DETAIL -->
		<fieldset class="inputs-group">
			<legend>Building Detail</legend>

			<TextInput
				type="number"
				id="parking"
				label="Parking"
				valid={isNumber(parking_spaces)}
				validityMessage="Parking spaces, ex: 3"
				value={parking_spaces}
				on:input={event => (parking_spaces = event.target.value)} />

			<TextInput
				type="number"
				id="rooms"
				label="Rooms"
				valid={isNumber(rooms_count)}
				validityMessage="Rooms count, ex: 3"
				value={rooms_count}
				on:input={event => (rooms_count = event.target.value)} />

			<TextInput
				type="number"
				id="beds"
				label="Beds"
				valid={isNumber(beds_count)}
				validityMessage="Bedrooms count, ex: 6"
				value={beds_count}
				on:input={event => (beds_count = event.target.value)} />

			<TextInput
				type="number"
				id="baths"
				label="Baths"
				valid={isNumber(baths_count)}
				validityMessage="Baths count, ex: 3"
				value={baths_count}
				on:input={event => (baths_count = event.target.value)} />

			<TextInput
				type="number"
				id="half_baths"
				label="Half Baths"
				valid={isNumber(half_baths_count)}
				validityMessage="Half Baths count, ex: 2"
				value={half_baths_count}
				on:input={event => (half_baths_count = event.target.value)} />
		</fieldset>

		<!-- PRICES -->
		<fieldset class="inputs-group">
			<legend>Prices</legend>

			<TextInput
				type="number"
				id="price"
				label="Price"
				valid={isNumber(price)}
				validityMessage="In $, ex: 999000"
				value={price}
				on:input={event => (price = event.target.value)} />

			<TextInput
				type="number"
				id="rent"
				label="Rent"
				valid={isNumber(rent)}
				validityMessage="Per month in $, ex: 600"
				value={rent}
				on:input={event => (rent = event.target.value)} />

			<TextInput
				type="number"
				id="taxes"
				label="Taxes"
				valid={isNumber(taxes)}
				validityMessage="Per year in $, ex: 900"
				value={taxes}
				on:input={event => (taxes = event.target.value)} />

			<TextInput
				type="number"
				id="fees"
				label="Fees"
				valid={isNumber(fees)}
				validityMessage="Per month in $, ex: 300"
				value={fees}
				on:input={event => (fees = event.target.value)} />
		</fieldset>

		<!-- LOCATION -->
		<fieldset class="inputs-group">
			<legend>Location</legend>

			<TextInput
				id="address"
				label="Address"
				valid={!isEmpty(address)}
				validityMessage="Bosque De Dona Rosa, 1 Rotonda, Casa 2"
				value={address}
				on:input={event => (address = event.target.value)} />

			<TextInput
				type="number"
				id="lat"
				label="Latitude"
				valid={isNumber(latitude)}
				validityMessage="ex: 10.0153302"
				value={latitude}
				on:input={event => (latitude = event.target.value)} />

			<TextInput
				type="number"
				id="lon"
				label="Longitude"
				valid={isNumber(longitude)}
				validityMessage="ex: -84.1504491"
				value={longitude}
				on:input={event => (longitude = event.target.value)} />

			<Button type="button" mode="outline" on:click="{getPosition}">Get current GPS</Button>
		</fieldset>

		<!-- CONTACT -->
		<fieldset class="inputs-group">
			<legend>Contact</legend>

			<TextInput
				type="email"
				id="email"
				label="Email"
				valid={isValidEmail(contact_email)}
				validityMessage="ex: this@that.something"
				value={contact_email}
				on:input={event => (contact_email = event.target.value)} />

			<TextInput
				type="tel"
				id="phone"
				label="Phone"
				validityMessage="Phone ex: 12345678"
				value={contact_phone}
				on:input={event => (contact_phone = event.target.value)} />
		</fieldset>

		<!-- OTHER DETAILS -->
		<fieldset class="inputs-group">
			<legend>Other</legend>

			<!-- since it doesnt have dynamic type, we can use bind:value instead of value and on:input -->
			<TextInput
				controlType="textarea"
				id="description"
				label="Description"
				valid={descriptionValid}
				validityMessage="Say something"
				bind:value={description} />

			<TextInput
				id="features"
				label="Features"
				valid={!isEmpty(features)}
				validityMessage="comma separated"
				value={features}
				on:input={event => (features = event.target.value)} />

			<TextInput
				id="photos"
				label="Photos"
				valid={!isEmpty(photos)}
				validityMessage="URL, comma separated"
				value={photos}
				on:input={event => (photos = event.target.value)} />
		</fieldset>

	</form>


	<Button type="button" mode="outline" on:click="{cancel}">Cancel</Button>
	<Button type="button" on:click="{submitForm}" disabled="{!formIsValid}">Submit new Property</Button>

</section>