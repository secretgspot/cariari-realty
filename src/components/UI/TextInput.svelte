<script>
	export let controlType = null; // text | textarea
	export let id;
	export let label;
	export let rows = 3;
	export let value; // value={value} replaces bind, and on:input forwards data back to parent
	export let type = "text"; // text | email | phone
	export let valid = true; // validation
	export let validityMessage = '';

	let touched = false;
</script>

<style lang='scss'>
	input,
	textarea {
		display: block;
		width: 100%;
		font: inherit;
		border: none;
		border-bottom: 2px solid #ccc;
		border-radius: 3px 3px 0 0;
		background: white;
		padding: 0.15rem 0.25rem;
		transition: border-color 0.1s ease-out;
	}

	input:focus,
	textarea:focus {
		border-color: #e40763;
		outline: none;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		width: 100%;
	}

	.form-control {
		padding: 0.5rem 0;
		width: 100%;
		margin: 0.25rem 0;
	}

	.invalid {
		border-color: tomato;
		background: rgb(255, 234, 234);
	}

	.error-message {
		color: tomato;
		margin: 0.25rem 0;
	}
</style>

<div class="form-control">
	<label for="{id}">{label}</label>
	{#if controlType === 'textarea'}
	<textarea class:invalid={!valid && touched} rows="{rows}" id="{id}" bind:value on:input on:blur={() => touched = true}></textarea>
	{:else}
	<input class:invalid={!valid && touched} type="{type}" id="{id}" value={value} on:input on:blur={() => touched = true} />
	{/if}
	{#if validityMessage && !valid && touched}
	<p class="error-message">{validityMessage}</p>
	{/if}
</div>