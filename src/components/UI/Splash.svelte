<script>
	import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
	import Logo from '../UI/Logo.svelte';

	const dispatch = createEventDispatcher();

	function closeSplash() {
		dispatch('splashed');
	}
</script>

<style lang='scss'>
	.splash {
		z-index: 11;
		position: fixed; top: 0; bottom: 0; left: 0; right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.backdrop {
		/* background: rgba(255,255,255,0.18); */
		background: rgba(0, 0, 0, 0.63);
		width: 100%;
		height: 100%;
		position: absolute;
	}

	@media screen and (orientation: portrait) {
		.logo-group { flex-direction: column; }
	}
	.logo-group {
		z-index: 12;
		display: flex;
		align-items: center;
		user-select: none;
		cursor: pointer;
	}
	.logo-group h1 {
		color: white;
		text-transform: uppercase;
		font-family: 'Economica', sans-serif;
		margin: 1rem 2rem;
	}
</style>

<div transition:fade class="splash" on:click={closeSplash}>
	<div class="backdrop"></div>

	<div class="logo-group">
		<h1>Cariari</h1>
		<Logo type="regular" color="gold" size="150" />
		<h1>Realty</h1>
	</div>
</div>