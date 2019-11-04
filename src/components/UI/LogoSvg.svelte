<script>
	export let animate = false;
	export let ring = true;
	export let style = "gold";
	export let size = "36";
	export let fixed = '';
	export let time = 9;
</script>

<style>
	.logo {
		z-index: 10;
		cursor: pointer;
	}
	.fixed {
		position: fixed;
		top: 10px;
		left: 10px;
	}

	.cls-2 {
		fill: none;
		stroke-width: 6px;
	}
	.cls-2.bw { stroke: var(--color-black, #231f20); }
	.cls-1 { fill-rule: evenodd; }
	.cls-1.bw { fill: var(--color-black, #231f20); }
</style>

<svg class="logo {fixed}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 220 220" width="{size}" height="{size}" on:click>
	<defs>
		<!-- Da gradient -->
		<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0">
			<stop offset="0%" style="stop-color:#8d755d;"/>
			<stop offset="12%" style="stop-color:#b1872d;"/>
			<stop offset="36%" style="stop-color:#faf394;"/>
			<stop offset="50%" style="stop-color:#8d755d;"/>
			<stop offset="64%" style="stop-color:#ceaa41;"/>
			<stop offset="76%" style="stop-color:#faf394;"/>
			<stop offset="88%" style="stop-color:#b1872d;"/>
			<stop offset="100%" style="stop-color:#8d755d;"/>
		</linearGradient>

		<pattern id="pattern" x="0" y="0" width="220%" height="220%" patternUnits="userSpaceOnUse">
			<circle cx="110" cy="110" r="106.5" fill="url(#gradient)">
				<animateTransform  attributeType="XML"
								 attributeName="transform"
								 type="rotate"
								 from="0" to="360" begin="0"
								 dur="{time}s"
								 repeatCount="{animate ? 'indefinite' : 0}"/>
			</circle>
			<circle cx="110" cy="110" r="106.5" fill="url(#gradient)">
				<animateTransform  attributeType="XML"
								 attributeName="transform"
								 type="rotate"
								 from="360" to="0" begin="360"
								 dur="{time}s"
								 repeatCount="{animate ? 'indefinite' : 0}"/>
			</circle>
			<rect x="0" y="0" width="220%" height="220%" fill="url(#gradient)">
				<animate attributeType="XML"
								 attributeName="x"
								 from="0" to="220%"
								 dur="{time}s"
								 repeatCount="{animate ? 'indefinite' : 0}"/>
			</rect>
			<rect x="-220%" y="0" width="220%" height="220%" fill="url(#gradient)">
				<animate attributeType="XML"
								 attributeName="x"
								 from="-220%" to="0"
								 dur="{time}s"
								 repeatCount="{animate ? 'indefinite' : 0}"/>
			</rect>
		</pattern>
	</defs>
	<title>CariariRealty</title>
	<g id="bat" fill="url(#pattern)">
		<path class="cls-1 {style}" d="M182.2,173.8c.7,2.6.4,6.2-1.9,8.5s-7.2,2.1-12.5.9a104.3,104.3,0,0,1-14.4-4.7c-10.1-5.5-25.3-8.3-42.4-9.5-17.1,1.2-32.3,4-42.4,9.5a104.3,104.3,0,0,1-14.4,4.7c-5.3,1.2-9.8,1.6-12.5-.9s-2.6-5.9-1.9-8.5c1.6-6.5,9.4-9.5,13.4-11.4s15.1-10.9,24.1-19.8,12.3-17.2,19.3-28.3c1.4-2.3,4.6-7.4,2.9-12.3-1.1-2.7-3.8-5.7-6.8-5.6s-3.6,1.5-4.8,2.8-4,4.4-5.8,6.6A97.2,97.2,0,0,0,60.9,83.1,99.5,99.5,0,0,0,37.8,69.9a18.3,18.3,0,0,1,9.7-8.5c3.2-1.1,7.3-1.2,13.4,1,9.1,3.3,14.9,9.2,24.1,16,4.6,3.5,8.5,5.8,12.5,4.7s8.9-7,7.7-12.2a9.1,9.1,0,0,0-3.8-5.7c-3.6-2.5-8.7-1.1-10.6-3.8s.4-4.6-1-7.5A10.2,10.2,0,0,0,86,50.1a13.4,13.4,0,0,0-6.8-1.9c2.3-3.4,4.5-6.9,6.8-10.4a28,28,0,0,0,6.7,4.7A34,34,0,0,0,111,46.3a34,34,0,0,0,18.3-3.8,28,28,0,0,0,6.7-4.7c2.3,3.5,4.5,7,6.8,10.4a13.4,13.4,0,0,0-6.8,1.9,10.2,10.2,0,0,0-3.8,3.8c-1.4,2.9.5,5.4-1,7.5s-6.9,1.3-10.6,3.8a9.6,9.6,0,0,0-3.8,5.7c-1.2,5.2,3,11,7.7,12.2s7.9-1.2,12.5-4.7c9.2-6.8,15-12.7,24.1-16,6.1-2.2,10.2-2.1,13.4-1a18.3,18.3,0,0,1,9.7,8.5,99.5,99.5,0,0,0-23.1,13.2,97.2,97.2,0,0,0-21.2,22.7c-1.8-2.2-3.7-4.4-5.8-6.6s-2.7-2.8-4.8-2.8-5.7,2.9-6.8,5.6c-1.7,4.9,1.5,10,2.9,12.3,7,11.1,10.5,19.7,19.3,28.3s19.3,17.7,24.1,19.8S180.6,167.3,182.2,173.8Z" transform="translate(-1 -1)"/>
	</g>
	{#if ring}
	<g id="ring" stroke="url(#pattern)">
		<circle class="cls-2 {style}" cx="110" cy="110" r="106.5"/>
	</g>
	{/if}
</svg>