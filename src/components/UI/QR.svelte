<script>
	import qr  from 'qr.js';
	import { onMount } from 'svelte';

	export let size = 180;
	export let message = '';

	let canvas;
	$: qrcode = qr(message);

	onMount(() => {
		setTimeout(() => {
			const ctx = canvas.getContext('2d');

			let cells = qrcode.modules;

			var tileW = canvas.width  / cells.length;
			var tileH = canvas.height / cells.length;

			for (var r = 0; r < cells.length ; ++r) {
				let row = cells[r];
				for (var c = 0; c < row.length ; ++c) {
					ctx.fillStyle = row[c] ? '#000' : '#fff';
					let w = (Math.ceil((c+1)*tileW) - Math.floor(c*tileW));
					let h = (Math.ceil((r+1)*tileH) - Math.floor(r*tileH));
					ctx.fillRect(Math.round(c*tileW), Math.round(r*tileH), w, h);
				}
			}
		}, 0);
	});
</script>

<canvas bind:this={canvas} width={size} height={size} />