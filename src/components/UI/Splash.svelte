<script>
	import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
	import LogoSvg from '../UI/LogoSvg.svelte';

	const dispatch = createEventDispatcher();

	function closeSplash() {
		dispatch('splashed');
	}
</script>

<style>
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
	.logo-group {
		z-index: 12;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		cursor: pointer;
		position: relative;
	}
	.logo-group::before,
	.logo-group::after {
		position: absolute;
		color: var(--color-white);
		font-size: 2rem;
		font-weight: lighter;
		text-transform: uppercase;
		margin: 0 1rem;
	}
	.logo-group::before {
		content: "Cariari";
		right: 100%;
	}
	.logo-group::after {
		content: "Realty";
		left: 100%;
	}
	@media screen and (orientation: portrait) {
		.logo-group::before,
		.logo-group::after {
			margin: 1rem 0;
			left: 0; right: 0;
			text-align: center;
		}
		.logo-group::before { bottom: 100%; }
		.logo-group::after { top: 100%; }
	}
</style>

<div transition:fade class="splash" on:click={closeSplash}>
	<div class="backdrop"></div>

	<div class="logo-group">
		<!-- <Logo type="regular" color="gold" size="150" /> -->
		<LogoSvg animate="{true}" kind="gold" size="150" time="{3}" />
	</div>
</div>