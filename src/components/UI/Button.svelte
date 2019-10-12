<script>
  export let type = "button"; // button | submit | reset
  export let href = null;
  export let mode = null; // outline
  export let color = null; // cyan | magenta | orange
  export let disabled = false;
</script>

<style>
  button,
  a {
    font: inherit;
    border: 1px solid var(--color-black);
    background: transparent;
    /* width: 369px; */
    height: 81px;
    padding: 0.5rem 1rem;
    color: var(--color-black);
    border-radius: 9px;
    box-shadow: 0px 1px 2px hsla(0, 0%, 0%, 0.36);
    cursor: pointer;
    text-decoration: none;
    flex: 1 1 auto;
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
  }

  /* include a border on all button but the first, to avoid a border when only one element exist */
  button:not(:first-of-type),
  a:not(:first-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  button:not(:last-of-type),
  a:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button:focus { align-content: none; }

  button:hover,
  button:active,
  a:hover,
  a:active {
    background: var(--color-white);
    border-color: var(--color-black);
    outline: none;
  }

  button:hover,
  a:hover {
    box-shadow: 0px 0px 2px hsla(0, 0%, 0%, 0.36);
  }

  button:active,
  a:active {
    box-shadow: inset 0px 1px 3px hsla(0, 0%, 0%, 0.36);
  }

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    background: var(--color-light);
    border-color: var(--color-light);
    color: var(--color-dark);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* BLACK  */
  .black {
    background: inherit;
    border-color: var(--color-black);
    color: var(--color-black);
  }
  .black:hover,
  .black:active {
    background: var(--color-black);
    border-color: var(--color-black);
    color: var(--color-white);
  }

  /* MAGENTA  */
  .magenta {
    background: inherit;
    border-color: var(--color-magenta);
    color: var(--color-magenta);
  }
  .magenta:hover,
  .magenta:active {
    background: var(--color-magenta);
    border-color: var(--color-magenta);
    color: var(--color-white);
  }

  /* CYAN  */
  .cyan {
    background: inherit;
    border-color: var(--color-cyan);
    color: var(--color-cyan);
  }
  .cyan:hover,
  .cyan:active {
    background: var(--color-cyan);
    border-color: var(--color-cyan);
    color: var(--color-white);
  }

  /* ORANGE  */
  .orange {
    background: inherit;
    border-color: var(--color-orange);
    color: var(--color-orange);
  }
  .orange:hover,
  .orange:active {
    background: var(--color-orange);
    border-color: var(--color-orange);
    color: var(--color-white);
  }

 /* SUCCESS  */
  .success {
    background: inherit;
    border-color: var(--color-success);
    color: var(--color-success);
  }
  .success:hover,
  .success:active {
    background: var(--color-success);
    border-color: var(--color-success);
    color: var(--color-white);
  }

 /* DANGER  */
  .danger {
    background: inherit;
    border-color: var(--color-danger);
    color: var(--color-danger);
  }
  .danger:hover,
  .danger:active {
    background: var(--color-danger);
    border-color: var(--color-danger);
    color: var(--color-white);
  }


  /* CLOSE */
  .close {
    background: transparent;
    /* color: #cf0056; */
    box-shadow: none;
    padding: 0 0;
    border-radius: 50px;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 63px;
    height: 63px;
  }

  .close:hover,
  .close:active {
    background: var(--color-black);
    color: var(--color-white);
    box-shadow: none;
  }

  .close:disabled,
  .close:disabled:hover,
  .close:disabled:active {
    background: transparent;
    color: var(--color-light);
  }
</style>

{#if href}
  <a class="{mode} {color}" {href}>
    <slot />
  </a>
{:else}
  <button class="{mode} {color}" {type} on:click {disabled}>
    <slot />
  </button>
{/if}
