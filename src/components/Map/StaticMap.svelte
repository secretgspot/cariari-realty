<script>
	export let lat = "0";
	export let lon = "0";
	export let width = "300";
	export let height = "150";
	export let zoom = "15";
	export let pitch = '';
	export let bearing = '';
	export let marker = "https://www.mapbox.com/img/rocket.png";

	let baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';
	let apiKey = process.env.mapboxToken;

	let imgSrc = `${baseUrl}/url-${encodeURIComponent(marker)}(${lon},${lat})/${lon},${lat},${zoom}/${width}x${height}?access_token=${apiKey}`
</script>

<img src="{imgSrc}" alt="static map with marker" />