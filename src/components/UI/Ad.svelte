<script>
	export let width;
	export let height;
</script>

<style>
	.advertising {
		position: relative;
		background: var(--color-white);
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 3px 3px 0px hsla(215, 27%, 19%, 0.12);
		/* margin: 2rem 0; */
		text-align: center;
	}
	.advertising::after {
		content: 'ad';
		position: absolute;
		bottom: 100%;
		right: 0;
		font-size: 9px;
		/* color: lavender; */
		color: var(--color-dark);
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