'use strict';

var api = require('./api-12e8b0c7.js');

let isAdmin = api.writable(false);

/* src\components\UI\Toggle.svelte generated by Svelte v3.12.1 */

const css = {
	code: ".toggle.svelte-2bbr3u{user-select:none}.toggle-input.svelte-2bbr3u{border:0;clip:rect(0 0 0 0);height:auto;margin:0;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap}.toggle-label.svelte-2bbr3u{cursor:pointer;position:relative}.toggle-label.svelte-2bbr3u,.toggle-title.svelte-2bbr3u,.toggle-track.svelte-2bbr3u,.toggle-switch.svelte-2bbr3u{display:inline-block;vertical-align:middle}.toggle-title+.toggle-track.svelte-2bbr3u{margin-left:0.375em}.toggle-track.svelte-2bbr3u{position:relative;top:-0.125em;width:54px;height:27px;background-color:var(--color-light);border:1px solid rgba(0, 0, 0, 0.15);border-radius:var(--border-radius);transition:0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);transition-property:background-color, border-color;box-shadow:inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.09)}.toggle-label .toggle-input:checked~.toggle-track.svelte-2bbr3u{background-color:var(--color-success);border-color:rgba(0, 0, 0, 0.05)}.toggle-track+.toggle-title.svelte-2bbr3u{margin-left:0.375em}.toggle-switch.svelte-2bbr3u{position:absolute;top:0;right:27px;bottom:0;left:0;background-color:var(--color-white);border-radius:var(--border-radius);box-shadow:1px 1px 6px rgba(0, 0, 0, 0.2),\r\n      inset 1px 1px 3px rgba(255, 255, 255, 0.8);transition:0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);transition-property:left, right;transition-delay:0s, 0.01s}.toggle-label.svelte-2bbr3u:active .toggle-switch.svelte-2bbr3u{box-shadow:1px 1px 6px rgba(0, 0, 0, 0.2),\r\n      inset 1px 1px 3px rgba(255, 255, 255, 0.8),\r\n      inset 1px 1px 6px rgba(0, 0, 0, 0.1)}.toggle-label .toggle-input:checked~.toggle-track.svelte-2bbr3u>.toggle-switch.svelte-2bbr3u{right:0;left:27px;transition:0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);transition-property:left, right;transition-delay:0.01s, 0s}",
	map: "{\"version\":3,\"file\":\"Toggle.svelte\",\"sources\":[\"Toggle.svelte\"],\"sourcesContent\":[\"<script>\\r\\n  export let checked = false;\\r\\n  export let label = \\\"Checked\\\";\\r\\n  export let disabled = false;\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n  .toggle {\\r\\n    user-select: none;\\r\\n  }\\r\\n  .toggle-input {\\r\\n    border: 0;\\r\\n    clip: rect(0 0 0 0);\\r\\n    height: auto;\\r\\n    margin: 0;\\r\\n    overflow: hidden;\\r\\n    padding: 0;\\r\\n    position: absolute;\\r\\n    width: 1px;\\r\\n    white-space: nowrap;\\r\\n  }\\r\\n  .toggle-label {\\r\\n    cursor: pointer;\\r\\n    position: relative;\\r\\n  }\\r\\n  .toggle-label,\\r\\n  .toggle-title,\\r\\n  .toggle-track,\\r\\n  .toggle-switch {\\r\\n    display: inline-block;\\r\\n    vertical-align: middle;\\r\\n  }\\r\\n  .toggle-title + .toggle-track {\\r\\n    margin-left: 0.375em;\\r\\n  }\\r\\n  .toggle-track {\\r\\n    position: relative;\\r\\n    top: -0.125em;\\r\\n    width: 54px;\\r\\n    height: 27px;\\r\\n    background-color: var(--color-light);\\r\\n    border: 1px solid rgba(0, 0, 0, 0.15);\\r\\n    border-radius: var(--border-radius);\\r\\n    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);\\r\\n    transition-property: background-color, border-color;\\r\\n    box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.09);\\r\\n  }\\r\\n  .toggle-label .toggle-input:checked ~ .toggle-track {\\r\\n    background-color: var(--color-success);\\r\\n    border-color: rgba(0, 0, 0, 0.05);\\r\\n  }\\r\\n  .toggle-track + .toggle-title {\\r\\n    margin-left: 0.375em;\\r\\n  }\\r\\n  .toggle-switch {\\r\\n    position: absolute;\\r\\n    top: 0;\\r\\n    right: 27px;\\r\\n    bottom: 0;\\r\\n    left: 0;\\r\\n    background-color: var(--color-white);\\r\\n    border-radius: var(--border-radius);\\r\\n    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2),\\r\\n      inset 1px 1px 3px rgba(255, 255, 255, 0.8);\\r\\n    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);\\r\\n    transition-property: left, right;\\r\\n    transition-delay: 0s, 0.01s;\\r\\n  }\\r\\n  .toggle-label:active .toggle-switch {\\r\\n    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2),\\r\\n      inset 1px 1px 3px rgba(255, 255, 255, 0.8),\\r\\n      inset 1px 1px 6px rgba(0, 0, 0, 0.1);\\r\\n  }\\r\\n  .toggle-label .toggle-input:checked ~ .toggle-track > .toggle-switch {\\r\\n    right: 0;\\r\\n    left: 27px;\\r\\n    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);\\r\\n    transition-property: left, right;\\r\\n    transition-delay: 0.01s, 0s;\\r\\n  }\\r\\n</style>\\r\\n\\r\\n\\r\\n<div class=\\\"toggle\\\">\\r\\n  <label class=\\\"toggle-label\\\">\\r\\n    <input class=\\\"toggle-input\\\" type=\\\"checkbox\\\" bind:checked value=\\\"{label}\\\" on:change {disabled} />\\r\\n    <span class=\\\"toggle-track\\\">\\r\\n      <span class=\\\"toggle-switch\\\" />\\r\\n    </span>\\r\\n    <span class=\\\"toggle-title\\\">{label}</span>\\r\\n  </label>\\r\\n</div>\\r\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

const Toggle = api.create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { checked = false, label = "Checked", disabled = false } = $$props;

	if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0) $$bindings.checked(checked);
	if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);

	$$result.css.add(css);

	return `<div class="toggle svelte-2bbr3u">
	  <label class="toggle-label svelte-2bbr3u">
	    <input class="toggle-input svelte-2bbr3u" type="checkbox"${api.add_attribute("value", label, 0)}${disabled ? " disabled" : "" }${api.add_attribute("checked", checked, 1)}>
	    <span class="toggle-track svelte-2bbr3u">
	      <span class="toggle-switch svelte-2bbr3u"></span>
	    </span>
	    <span class="toggle-title svelte-2bbr3u">${api.escape(label)}</span>
	  </label>
	</div>`;
});

exports.Toggle = Toggle;
exports.isAdmin = isAdmin;
