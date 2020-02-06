<script>
  export let checked = false;
  export let label = "Checked";
  export let disabled = false;
</script>

<style>
  .toggle {
    user-select: none;
  }
  .toggle-input {
    border: 0;
    clip: rect(0 0 0 0);
    height: auto;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
  .toggle-label {
    cursor: pointer;
    position: relative;
  }
  .toggle-label,
  .toggle-title,
  .toggle-track,
  .toggle-switch {
    display: inline-block;
    vertical-align: middle;
  }
  .toggle-title + .toggle-track {
    margin-left: 0.375em;
  }
  .toggle-track {
    position: relative;
    top: -0.125em;
    width: 54px;
    height: 27px;
    background-color: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: background-color, border-color;
    box-shadow: inset 0 2px 4px 0 var(--shadow);
  }
  .toggle-label .toggle-input:checked ~ .toggle-track {
    /* background-color: var(--color-success); */
    /* border-color: var(--color-success); */
  }
  .toggle-track + .toggle-title {
    margin-left: 0.375em;
  }
  .toggle-switch {
    position: absolute;
    top: 0;
    right: 27px;
    bottom: 0;
    left: 0;
    background-color: var(--bg-inverted);
    border-radius: var(--border-radius);
    /* box-shadow: 1px 1px 6px var(--shadow),
      inset 1px 1px 3px var(--bg-inverted); */
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0s, 0.01s;
  }
  .toggle-label:active .toggle-switch {
    background-color: var(--bg-tertiary);
    /* box-shadow: 1px 1px 6px var(--shadow),
      inset 1px 1px 3px var(--bg-inverted),
      inset 1px 1px 6px var(--shadow); */
  }
  .toggle-label .toggle-input:checked ~ .toggle-track > .toggle-switch {
    right: 0;
    left: 27px;
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0.01s, 0s;
    background-color: var(--color-success);
  }
</style>


<div class="toggle">
  <label class="toggle-label">
    <input class="toggle-input" type="checkbox" bind:checked value="{label}" on:change {disabled} />
    <span class="toggle-track">
      <span class="toggle-switch" />
    </span>
    <span class="toggle-title">{label}</span>
  </label>
</div>
