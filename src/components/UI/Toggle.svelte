<script>
  export let checked = false;
  export let label = "Checked";
  export let disabled = false;
</script>

<style>
  .toggle {
    margin-bottom: 1em;
    font-size: 1rem;
    user-select: none;
  }
  .toggle + .toggle {
    margin-top: 1.25em;
    padding-top: 1em;
    border-top: 1px solid var(--color-light);
  }
  .toggle {
    position: relative;
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
    width: 2.8125em;
    height: 1.875em;
    background-color: var(--color-light);
    border: 0.0625em solid rgba(0, 0, 0, 0.15);
    border-radius: 24em;
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: background-color, border-color;
  }
  .toggle-label .toggle-input:checked ~ .toggle-track {
    background-color: var(--color-success);
    border-color: rgba(0, 0, 0, 0.05);
  }
  .toggle-track + .toggle-title {
    margin-left: 0.375em;
  }
  .toggle-switch {
    position: absolute;
    top: 0;
    right: 0.9375em;
    bottom: 0;
    left: 0;
    background-color: var(--color-white);
    border-radius: 24em;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2),
      inset 1px 1px 3px rgba(255, 255, 255, 0.8);
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0s, 0.01s;
  }
  .toggle-label:active .toggle-switch {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2),
      inset 1px 1px 3px rgba(255, 255, 255, 0.8),
      inset 1px 1px 6px rgba(0, 0, 0, 0.1);
  }
  .toggle-label .toggle-input:checked ~ .toggle-track > .toggle-switch {
    right: 0;
    left: 0.9375em;
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0.01s, 0s;
  }
</style>

<div class="toggle">
  <div class="controls">
    <div class="toggle">
      <label class="toggle-label">
        <input class="toggle-input" type="checkbox" bind:checked value="{label}" on:change {disabled} />
        <span class="toggle-track">
          <span class="toggle-switch" />
        </span>
        <span class="toggle-title">{label}</span>
      </label>
    </div>
  </div>
</div>
