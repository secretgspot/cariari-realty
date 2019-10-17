			<script>
  // imports
  import { afterUpdate } from 'svelte';
  import { fade, scale, fly } from 'svelte/transition';
	import { cubicIn, cubicOut  } from "svelte/easing"; // animate values
	import Button from './Button.svelte';

  // public props
  export let triggerRef = undefined;
  export let showModal = false;
  export let title = 'Modal title';
  export let role = 'dialog';

  // local props
  let buttonRef;

  // functions
  const handleClose = () => (showModal = false);
  const handleEsc = e => e.key === 'Escape' && handleClose();

  // lifecycle
  afterUpdate(() => {
    if (showModal) {
      buttonRef.focus();
    } else {
      triggerRef && triggerRef.focus();
    }
  });
</script>

<style>
  aside {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: hsla(0, 9%, 96%, 0.81);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 10;
  }

  aside .box {
    background: #fff;
    width: 63vw;
    max-width: 666px;
    border-radius: 9px;
    position: relative;
    box-shadow: 0px 12px 15px 0px hsla(0, 0%, 0%, 0.18);
  }

  aside .box header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }

  aside .box header h3 {
		margin: 0;
		font-size: 23px;
		font-weight: 500;
  }

  aside .box header button {
    background: none;
    border: none;
    padding: 0;
    font-size: 20px;
    position: absolute;
    right: 20px;
    color: #ccc;
    font-weight: lighter;
    cursor: pointer;
  }

  aside .box main {
    padding: 20px;
  }

  aside .box footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
		background: hsl(0, 10%, 96%);
		border-radius: 0 0 9px 9px;
		box-shadow: inset 0px -1px 0px 1px hsla(0, 0%, 100%, 0.63);
  }
</style>

{#if showModal}
	<aside
				 on:keydown="{handleEsc}"
				 aria-labelledby="modal-heading"
				 aria-modal="true" tabIndex="{-1}" role="{role}"
				 in:fade
				 out:fade
				 on:click|self="{handleClose}"
				 class="overlay">

		<div in:scale="{{ start: 0.1, easing: cubicIn}}" out:scale="{{start: 0.1, easing: cubicOut}}" class="box">
			<header>
				<h3 id="modal-heading">{title}</h3>
				<button aria-label='Close modal' bind:this="{buttonRef}" on:click="{handleClose}">&#10005;</button>
			</header>
			<main>
				<slot name="content">No content provided</slot>
			</main>
			<footer>
				<slot />
			</footer>
		</div>
	</aside>
{/if}