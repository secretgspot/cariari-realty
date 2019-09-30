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
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
    cursor: pointer;
    text-decoration: none;
    flex: 1 1 auto;
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
  }

  button:focus {
    outline: none;
  }

  button:hover,
  button:active,
  a:hover,
  a:active {
    background: var(--color-white);
    border-color: var(--color-black);
    box-shadow: 1px 1px 8px rgba(77, 51, 51, 0.26);
  }

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    background: #ccc;
    border-color: #ccc;
    color: #959595;
    box-shadow: none;
    cursor: not-allowed;
  }

  /* SUCCESS  */
  .success {
    background: #01a129;
    border-color: #01a129;
  }

  .success:hover,
  .success:active {
    background: #1ac745;
    border-color: #1ac745;
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
    color: #ccc;
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
