<script>
	import { goto } from '@sapper/app';
	import LogoSvg from '../components/UI/LogoSvg.svelte';
	import Image from '../components/UI/Image.svelte';
	import Button from '../components/UI/Button.svelte';
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	.error-wrapper {
		width: 100vw;
		height: 100vh;
		display: grid;
		grid-template-columns: 1fr minmax(450px, 1fr);
		grid-template-rows: 1fr;
		grid-template-areas: "cartoon details";
		grid-gap: 3rem;
	}
	@media screen and (max-width: 768px) and (orientation: portrait) {
		.error-wrapper  {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
			grid-template-areas: "cartoon"
													 "details";
		 }
	}
	.logo-group {
		grid-area: cartoon;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error-group {
		grid-area: details;
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding: 2rem 3rem;
		/* margin: 3rem; */
		background: var(--bg-secondary);
		border-radius: var(--border-radius);
	}
	.error-group h1 {
		font-size: 6.3em;
		margin: 1rem 0;
		font-weight: bold;
	}
	.error-group h2 { margin: 0; }
	.error-group :global(a) {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 0 0 auto;
		margin-top: 1rem;
	}
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<LogoSvg animate="{true}" kind="gold" fixed="fixed" on:click="{() => goto('/')}" />

<section class="error-wrapper">
	<div class="logo-group">
		<Image type="{status}" />
	</div>

	<div class="error-group">
		<h1>{status}</h1>
		<h2>{error.message}</h2>

		{#if status == '404'}
		<p>
			The page you are looking for does not exist. How you got here is a mistery. But you can click the button below to go back to the homepage.
		</p>
		{/if}

		<Button href="/" mode="needy" color="success">Home</Button>

		{#if dev && error.stack}
			<pre>{error.stack}</pre>
		{/if}
	</div>
</section>
