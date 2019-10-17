<script>
	import Modal from './Modal.svelte';

	export let message;
	let showModal = true;
</script>

<style>

</style>

<!-- ERROR MODAL -->
<Modal title="An error has occured!" bind:showModal>
	<div slot="content">
		{message}
	</div>
</Modal>