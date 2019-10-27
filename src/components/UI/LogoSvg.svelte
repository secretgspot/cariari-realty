<script>
	export let animate = false;
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

	svg circle { transform-origin: center center; }
	.animate { animation: rotate 3s infinite; }
	.cls-2 {
		fill: none;
		stroke-width: 6px;
	}
	.cls-2.gold { stroke: url(#gold_5-2); }
	.cls-2.bw { stroke: var(--color-black, #231f20); }
	.cls-1 { fill-rule: evenodd; }
	.cls-1.bw { fill: var(--color-black, #231f20); }
	.cls-1.gold { fill: url(#gold_5); }

	@keyframes rotate{
			to{ transform: rotate(360deg); }
	}
</style>

<svg class="logo {fixed}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 220 220" width="{size}" height="{size}" on:click>
  <defs>
    <linearGradient id="gold_5" x1="37.83" y1="111" x2="184.17" y2="111" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="gold" stop-opacity=".9">
				<animate attributeName="stop-color" values="#c49a2f;#b1872d;#faf394;#ceaa41;#8f7426;#ceaa41;#faf394;#b1872d;#c49a2f" dur="{time}s" repeatCount="indefinite" />
			</stop>
			<stop offset="100%" stop-color="gold" stop-opacity=".9">
				<animate attributeName="stop-color" values="#8f7426;#ceaa41;#faf394;#b1872d;#c49a2f;#b1872d;#faf394;#ceaa41;#8f7426" dur="{time * 2}s" repeatCount="indefinite" />
				<animate attributeName="offset" values="1;.88;.76;.64;.50;.36;.24;.12;0;.12;.24;.36;.50;.64;.76;.88;1" dur="{time * 3}s" repeatCount="indefinite" />
			</stop>
    </linearGradient>
    <linearGradient id="gold_5-2" data-name="gold_5" x1="0" y1="109.99" x2="219.98" y2="109.99" xlink:href="#gold_5"/>
  </defs>
  <title>CariariRealty</title>
  <g id="bat">
    <path class="cls-1 {style}" d="M182.2,173.8c.7,2.6.4,6.2-1.9,8.5s-7.2,2.1-12.5.9a104.3,104.3,0,0,1-14.4-4.7c-10.1-5.5-25.3-8.3-42.4-9.5-17.1,1.2-32.3,4-42.4,9.5a104.3,104.3,0,0,1-14.4,4.7c-5.3,1.2-9.8,1.6-12.5-.9s-2.6-5.9-1.9-8.5c1.6-6.5,9.4-9.5,13.4-11.4s15.1-10.9,24.1-19.8,12.3-17.2,19.3-28.3c1.4-2.3,4.6-7.4,2.9-12.3-1.1-2.7-3.8-5.7-6.8-5.6s-3.6,1.5-4.8,2.8-4,4.4-5.8,6.6A97.2,97.2,0,0,0,60.9,83.1,99.5,99.5,0,0,0,37.8,69.9a18.3,18.3,0,0,1,9.7-8.5c3.2-1.1,7.3-1.2,13.4,1,9.1,3.3,14.9,9.2,24.1,16,4.6,3.5,8.5,5.8,12.5,4.7s8.9-7,7.7-12.2a9.1,9.1,0,0,0-3.8-5.7c-3.6-2.5-8.7-1.1-10.6-3.8s.4-4.6-1-7.5A10.2,10.2,0,0,0,86,50.1a13.4,13.4,0,0,0-6.8-1.9c2.3-3.4,4.5-6.9,6.8-10.4a28,28,0,0,0,6.7,4.7A34,34,0,0,0,111,46.3a34,34,0,0,0,18.3-3.8,28,28,0,0,0,6.7-4.7c2.3,3.5,4.5,7,6.8,10.4a13.4,13.4,0,0,0-6.8,1.9,10.2,10.2,0,0,0-3.8,3.8c-1.4,2.9.5,5.4-1,7.5s-6.9,1.3-10.6,3.8a9.6,9.6,0,0,0-3.8,5.7c-1.2,5.2,3,11,7.7,12.2s7.9-1.2,12.5-4.7c9.2-6.8,15-12.7,24.1-16,6.1-2.2,10.2-2.1,13.4-1a18.3,18.3,0,0,1,9.7,8.5,99.5,99.5,0,0,0-23.1,13.2,97.2,97.2,0,0,0-21.2,22.7c-1.8-2.2-3.7-4.4-5.8-6.6s-2.7-2.8-4.8-2.8-5.7,2.9-6.8,5.6c-1.7,4.9,1.5,10,2.9,12.3,7,11.1,10.5,19.7,19.3,28.3s19.3,17.7,24.1,19.8S180.6,167.3,182.2,173.8Z" transform="translate(-1 -1)"/>
  </g>
  <g id="ring">
    <circle class="cls-2 {style}" class:animate="{animate}" cx="110" cy="110" r="106.5"/>
  </g>
</svg>
