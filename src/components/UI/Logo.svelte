<script>
	export let type = 'regular'; // full | regular | minimal
	export let color = 'gold'; // gold | bw
	export let size = '36'; // in px
	export let fixed = '';
</script>

<style lang='scss'>
	.logo {
		z-index: 10;
		cursor: pointer;
	}
	.fixed {
		position: fixed;
		top: 10px;
		left: 10px;
	}
</style>

{#if type === 'regular'}
	<img class="logo regular {fixed} {color}" src="/images/logo/logo_regular_{color}.svg" width="{size}" alt="CR logo" on:click>
{:else if type === 'minimal'}
	<img class="logo minimal {fixed} {color}" src="/images/logo/logo_minimal_{color}.svg" width="{size}" alt="CR logo" on:click>
{:else if type === 'full'}
	<img class="logo full {fixed} {color}" src="/images/logo/logo_full_{color}.svg" width="{size}" alt="CR logo" on:click>
{/if}