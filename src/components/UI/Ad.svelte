<script>
	export let width;
	export let height;
</script>

<style>
	.advertising {
		position: relative;
		background: var(--bg-secondary);
		color: var(--txt-secondary);
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 1px 1px 0px var(--shadow);
		/* margin: 2rem 0; */
		text-align: center;
	}
	.advertising::after {
		content: 'ad';
		position: absolute;
		bottom: 100%;
		right: 0;
		font-size: 9px;
		color: var(--txt-secondary);
		line-height: 1;
		text-transform: uppercase;
	}
	.advertising small { font-size: 12px; }
</style>

<div class="advertising" style="width:{width}px; height:{height}px;">
	<slot>
		<small>{width}x{height}<br/>AD</small>
	</slot>
</div>