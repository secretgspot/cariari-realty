<script>
	import Icon from './Icon.svelte';
	export let type = 'text'; // icon | text
	export let label;
	export let value;
	export let direction = 'column'; // column | row
	export let loop = false; // for cases where object is passed
</script>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
	}
	/* .icon {
		width: 30px;
		height: 27px;
	} */
	.badge :global(svg) {
		color: var(--txt-primary);
	}
	.label {
		text-transform: uppercase;
		/* line-height: 1; */
		/* font-family: 'Economica', sans-serif; */
		color: var(--txt-tertiary);
	}
	.value {
		font-size: 1.8em;
		color: var(--txt-primary);
		/* line-height: 1; */
		/* font-family: 'Cabin', sans-serif; */
	}
	.row {
		flex-direction: row-reverse;
		justify-content: center;
	}
	.row .label { margin-right: 1rem; }
	.row .value {
		display: flex;
		flex-wrap: wrap;
	}
	.column {
		flex-direction: column;
	}

	span {
		margin: 0 0.2rem;
		border: 1px dashed var(--bg-secondary);
		padding: 0 0.2rem;
		border-radius: 6px;
		border-top: none;
		border-bottom: none;
		text-transform: uppercase;
	}
</style>

<div class="badge {direction}">
{#if type === 'icon'}
	<!-- <img class="icon" src="images/icons/icon_{label}.svg" alt="{label}"> -->
	<Icon type="{label}" size="30" />
	<div class="value">{value}</div>
{:else if type === 'text'}
	{#if loop}
	<div class="value">
		{#each value as val}
			<span>{ val }</span>
		{/each}
	</div>
	{:else}
		{#if value}
			<div class="value">{value}</div>
		{:else}
			<div class="value">N/A</div>
		{/if}
	{/if}
	<div class="label">{label}</div>
{/if}
</div>