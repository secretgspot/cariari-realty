<script>
	import { goto } from '@sapper/app';
	import Logo from '../components/UI/Logo.svelte';
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	.error-wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	@media screen and (orientation: portrait) {
		.logo-group { flex-direction: column; }
	}
	.logo-group {
		display: flex;
		align-items: center;
		user-select: none;
		cursor: pointer;
	}
	.logo-group h1 {
		text-transform: uppercase;
		font-family: 'Economica', sans-serif;
		margin: 1rem 2rem;
	}

	.error-group {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 2rem 3rem;
		margin: 3rem;
		border: 1px dotted;
		border-radius: 9px;
	}
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<section class="error-wrapper">
	<div class="logo-group" on:click="{() => goto('/')}">
		<h1>Cariari</h1>
		<Logo type="regular" color="gold" size="150" />
		<h1>Realty</h1>
	</div>

	<div class="error-group">
		<h1>{status}</h1>

		<p>{error.message}</p>

		{#if dev && error.stack}
			<pre>{error.stack}</pre>
		{/if}
	</div>
</section>
