<script>
	import { goto } from '@sapper/app';
	import QR from "../../components/UI/QR.svelte";
	import Badge from "../../components/UI/Badge.svelte";
	import Logo from '../../components/UI/Logo.svelte';

	export let property;
	export let query = false;
	export let slug = false;
</script>

<style>
	.print-property {
		overflow: auto;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-template-areas:
			"header header header header header header"
			"intro intro contact contact qr qr"
			"address address address location qr qr"
			"parcel parcel interior interior prices prices"
			"features features features features features features"
			"description description description description description description";
		width: 90vw;
		margin: 3rem auto;
	}
	.grid-container :global(.badge) { margin: 1rem; }
	.grid-container :global(.label) { font-size: 1em; }
	.grid-container :global(.value) { font-size: 1.3em; }
	.grid-container > div { border: 1px dotted lavender; }

	.qr {
		grid-area: qr;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}
	.address { grid-area: address; }
	.location { grid-area: location; }
	.header { grid-area: header; padding: 2rem; }
	.features { grid-area: features; }
	.description { grid-area: description; }
	.description :global(.value) { line-height: 1.4; }
	.intro { grid-area: intro; }
	.contact { grid-area: contact; }
	.parcel { grid-area: parcel; }
	.interior { grid-area: interior; }
	.prices { grid-area: prices; }
	.flexit {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

</style>


<svelte:head>
	<title>{property.msl}</title>
</svelte:head>

<Logo type="regular" color="bw" fixed="fixed" on:click="{() => goto('/')}" />

<section class="print-property">

	<!-- <h1>Print {slug} {JSON.stringify(query, null, 2)}</h1> -->


	<div class="grid-container">
		<div class="qr">
			<QR size="{180}" message="http://192.168.100.4:3000/property/{slug}?msl={property.msl}"/>
		</div>

		<div class="address">
			<Badge label="address" direction="row" value="{property.address}" />
		</div>

		<div class="location">
			<Badge label="lat" direction="row" value="{property.location.lat}" />
			<Badge label="lng" direction="row" value="{property.location.lng}" />
		</div>

		<div class="header">
			Hello, your property has been added to our online list of properties that are currently on the market.  If you would like to update details that are missing or unlist this property from our website, please scan QR code which will take you to our editing page where you can update details and or remove it from being listed. This service is free.
		</div>

		<div class="features">
			<Badge label="features" direction="row" value="{property.features}" />
		</div>

		<div class="description">
			<Badge label="description" direction="row" value="{property.description}" />
		</div>

		<div class="intro">
			<Badge label="msl" direction="row" value="{property.msl}" />
			<Badge label="land use" direction="row" value="{property.land_use}" />
			<Badge label="for" direction="row" value="{property.property_for}" />
			<!-- <Badge label="active" direction="row" value="{property.is_active}" /> -->
		</div>

		<div class="contact">
			<Badge label="phone" direction="row" value="{property.contact_phone}" />
			<Badge label="email" direction="row" value="{property.contact_email}" />
		</div>

		<div class="parcel flexit">
			<Badge label="built" value="{property.year_built}" />
			<Badge label="style" value="{property.building_style}" />
			<Badge label="lot" value="{property.lot_size}" />
			<Badge label="building" value="{property.building_size}" />
		</div>

		<div class="interior flexit">
			<Badge label="rooms" value="{property.rooms_count}" />
			<Badge label="beds" value="{property.beds_count}" />
			<Badge label="baths" value="{property.baths_count}" />
			<Badge label="half baths" value="{property.half_baths_count}" />
			<Badge label="parkings" value="{property.parking_spaces}" />
		</div>

		<div class="prices flexit">
			<Badge label="price" value="{property.price}" />
			<Badge label="rent" value="{property.rent}" />
			<Badge label="taxes" value="{property.taxes}" />
			<Badge label="fees" value="{property.fees}" />
		</div>
	</div>

<!--
	<pre>
	{JSON.stringify(property, null, 2)}
	</pre> -->

</section>
