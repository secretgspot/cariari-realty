<script>
	export let type = 'regular'; // full | regular | minimal | coin
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

<img class="logo {fixed} {color}" src="/images/logo/logo_{type}_{color}.svg" width="{size}" alt="CR logo" on:click>