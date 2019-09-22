<script>
	import Modal from './Modal.svelte';

	export let message;
</script>

<style lang='scss'>

</style>

<Modal title="An error occured!" on:cancel>
	<p>{message}</p>
</Modal>