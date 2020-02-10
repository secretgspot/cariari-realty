<script>
  export let type = "button"; // button | submit | reset
  export let href = null;
  export let mode = null; // outline | needy
  export let color = null; // cyan | magenta | orange
  export let disabled = false;
</script>

<style>
  button,
  a {
    font: inherit;
    border: 1px solid var(--border);
    background: transparent;
    /* width: 369px; */
    height: 81px;
    padding: 0.5rem 1rem;
    color: var(--txt-primary);
    border-radius: var(--border-radius);
    box-shadow: 0px 1px 1px var(--shadow);
    cursor: pointer;
    text-decoration: none;
    flex: 1 1 auto;
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
    position: relative;
    overflow: hidden;
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
    background: var(--bg-tertiary);
    border-color: var(--border);
    outline: none;
  }

  button:hover,
  a:hover {
    box-shadow: 0px 0px 2px var(--shadow);
  }

  button:active,
  a:active {
    box-shadow: inset 0px 1px 3px var(--shadow);
  }

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    background: var(--bg-secondary);
    border-color: var(--bg-tertiary);
    color: var(--txt-secondary);
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


  /* NEEDY */
  .needy:not(:disabled):before {
		content: '';
		position: absolute;
		top: 0; left: 0;
		z-index: 2;
		/* background: white; */
		opacity: 0.6;
		height: 100%; width: 100%;
		transform: skewX(-45deg);
		background: linear-gradient(to right, var(--color-white), var(--color-white) 20px, transparent 20px);
		transform-origin: left bottom;
		animation: shine 6s ease-in infinite;
  }
	@keyframes shine {
		0%   { transform: skewX(-45deg) translateX(-100%); }
		10%  { transform: skewX(-45deg) translateX(100%); }
		100% { transform: skewX(-45deg) translateX(100%); }
	}

  /* CLOSE */
  .close {
    background: transparent;
    /* color: #cf0056; */
    box-shadow: none;
    padding: 0 0;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 63px;
    height: 63px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    color: var(--txt-secondary);
  }
</style>

{#if href}
  <a class="{mode} {color}" {href}>
    <slot />
  </a>
{:else}
  <button class="{mode} {color}" {type} on:click|stopPropagation {disabled}>
    <slot />
  </button>
{/if}
