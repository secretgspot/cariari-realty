<script>
	export let width;
	export let height;
</script>

<style lang='scss'>
	.advertising {
		position: relative;
		background: white;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 1px lavender;
		margin: 2rem 0;
		text-align: center;
	}
	.advertising::after {
		content: 'ad';
		position: absolute;
		bottom: 100%;
		right: 0;
		font-size: 9px;
		color: lavender;
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