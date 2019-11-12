'use strict';

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, callback) {
    const unsub = store.subscribe(callback);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = current_component;
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function destroy_component(component, detaching) {
    if (component.$$.fragment) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
let SvelteElement;
if (typeof HTMLElement !== 'undefined') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    };
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

/* src\components\UI\Button.svelte generated by Svelte v3.12.1 */

const css = {
	code: "button.svelte-1ya8x44,a.svelte-1ya8x44{font:inherit;border:1px solid var(--color-black);background:transparent;height:81px;padding:0.5rem 1rem;color:var(--color-black);border-radius:var(--border-radius);box-shadow:0px 1px 2px hsla(0, 0%, 0%, 0.36);cursor:pointer;text-decoration:none;flex:1 1 auto;position:relative;overflow:hidden}button.svelte-1ya8x44:not(:first-of-type),a.svelte-1ya8x44:not(:first-of-type){border-top-left-radius:0;border-bottom-left-radius:0}button.svelte-1ya8x44:not(:last-of-type),a.svelte-1ya8x44:not(:last-of-type){border-top-right-radius:0;border-bottom-right-radius:0}button.svelte-1ya8x44:focus{align-content:none}button.svelte-1ya8x44:hover,button.svelte-1ya8x44:active,a.svelte-1ya8x44:hover,a.svelte-1ya8x44:active{background:var(--color-white);border-color:var(--color-black);outline:none}button.svelte-1ya8x44:hover,a.svelte-1ya8x44:hover{box-shadow:0px 0px 2px hsla(0, 0%, 0%, 0.36)}button.svelte-1ya8x44:active,a.svelte-1ya8x44:active{box-shadow:inset 0px 1px 3px hsla(0, 0%, 0%, 0.36)}button.svelte-1ya8x44:disabled,button.svelte-1ya8x44:disabled:hover,button.svelte-1ya8x44:disabled:active{background:var(--color-light);border-color:var(--color-light);color:var(--color-dark);box-shadow:none;cursor:not-allowed}.black.svelte-1ya8x44{background:inherit;border-color:var(--color-black);color:var(--color-black)}.black.svelte-1ya8x44:hover,.black.svelte-1ya8x44:active{background:var(--color-black);border-color:var(--color-black);color:var(--color-white)}.magenta.svelte-1ya8x44{background:inherit;border-color:var(--color-magenta);color:var(--color-magenta)}.magenta.svelte-1ya8x44:hover,.magenta.svelte-1ya8x44:active{background:var(--color-magenta);border-color:var(--color-magenta);color:var(--color-white)}.cyan.svelte-1ya8x44{background:inherit;border-color:var(--color-cyan);color:var(--color-cyan)}.cyan.svelte-1ya8x44:hover,.cyan.svelte-1ya8x44:active{background:var(--color-cyan);border-color:var(--color-cyan);color:var(--color-white)}.orange.svelte-1ya8x44{background:inherit;border-color:var(--color-orange);color:var(--color-orange)}.orange.svelte-1ya8x44:hover,.orange.svelte-1ya8x44:active{background:var(--color-orange);border-color:var(--color-orange);color:var(--color-white)}.success.svelte-1ya8x44{background:inherit;border-color:var(--color-success);color:var(--color-success)}.success.svelte-1ya8x44:hover,.success.svelte-1ya8x44:active{background:var(--color-success);border-color:var(--color-success);color:var(--color-white)}.danger.svelte-1ya8x44{background:inherit;border-color:var(--color-danger);color:var(--color-danger)}.danger.svelte-1ya8x44:hover,.danger.svelte-1ya8x44:active{background:var(--color-danger);border-color:var(--color-danger);color:var(--color-white)}.needy.svelte-1ya8x44:before{content:'';position:absolute;top:0;left:0;z-index:2;opacity:0.6;height:100%;width:100%;transform:skewX(-45deg);background:linear-gradient(to right, var(--color-white), var(--color-white) 20px, transparent 20px);transform-origin:left bottom;animation:svelte-1ya8x44-shine 6s ease-in infinite}@keyframes svelte-1ya8x44-shine{0%{transform:skewX(-45deg) translateX(-100%)}10%{transform:skewX(-45deg) translateX(100%)}100%{transform:skewX(-45deg) translateX(100%)}}.close.svelte-1ya8x44{background:transparent;box-shadow:none;padding:0 0;border-radius:50%;position:absolute;top:10px;right:10px;width:63px;height:63px}.close.svelte-1ya8x44:hover,.close.svelte-1ya8x44:active{background:var(--color-black);color:var(--color-white);box-shadow:none}.close.svelte-1ya8x44:disabled,.close.svelte-1ya8x44:disabled:hover,.close.svelte-1ya8x44:disabled:active{background:transparent;color:var(--color-light)}",
	map: "{\"version\":3,\"file\":\"Button.svelte\",\"sources\":[\"Button.svelte\"],\"sourcesContent\":[\"<script>\\r\\n  export let type = \\\"button\\\"; // button | submit | reset\\r\\n  export let href = null;\\r\\n  export let mode = null; // outline | needy\\r\\n  export let color = null; // cyan | magenta | orange\\r\\n  export let disabled = false;\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n  button,\\r\\n  a {\\r\\n    font: inherit;\\r\\n    border: 1px solid var(--color-black);\\r\\n    background: transparent;\\r\\n    /* width: 369px; */\\r\\n    height: 81px;\\r\\n    padding: 0.5rem 1rem;\\r\\n    color: var(--color-black);\\r\\n    border-radius: var(--border-radius);\\r\\n    box-shadow: 0px 1px 2px hsla(0, 0%, 0%, 0.36);\\r\\n    cursor: pointer;\\r\\n    text-decoration: none;\\r\\n    flex: 1 1 auto;\\r\\n    /* display: flex; */\\r\\n    /* justify-content: center; */\\r\\n    /* align-items: center; */\\r\\n    position: relative;\\r\\n    overflow: hidden;\\r\\n  }\\r\\n\\r\\n  /* include a border on all button but the first, to avoid a border when only one element exist */\\r\\n  button:not(:first-of-type),\\r\\n  a:not(:first-of-type) {\\r\\n    border-top-left-radius: 0;\\r\\n    border-bottom-left-radius: 0;\\r\\n  }\\r\\n  button:not(:last-of-type),\\r\\n  a:not(:last-of-type) {\\r\\n    border-top-right-radius: 0;\\r\\n    border-bottom-right-radius: 0;\\r\\n  }\\r\\n\\r\\n  button:focus { align-content: none; }\\r\\n\\r\\n  button:hover,\\r\\n  button:active,\\r\\n  a:hover,\\r\\n  a:active {\\r\\n    background: var(--color-white);\\r\\n    border-color: var(--color-black);\\r\\n    outline: none;\\r\\n  }\\r\\n\\r\\n  button:hover,\\r\\n  a:hover {\\r\\n    box-shadow: 0px 0px 2px hsla(0, 0%, 0%, 0.36);\\r\\n  }\\r\\n\\r\\n  button:active,\\r\\n  a:active {\\r\\n    box-shadow: inset 0px 1px 3px hsla(0, 0%, 0%, 0.36);\\r\\n  }\\r\\n\\r\\n  button:disabled,\\r\\n  button:disabled:hover,\\r\\n  button:disabled:active {\\r\\n    background: var(--color-light);\\r\\n    border-color: var(--color-light);\\r\\n    color: var(--color-dark);\\r\\n    box-shadow: none;\\r\\n    cursor: not-allowed;\\r\\n  }\\r\\n\\r\\n  /* BLACK  */\\r\\n  .black {\\r\\n    background: inherit;\\r\\n    border-color: var(--color-black);\\r\\n    color: var(--color-black);\\r\\n  }\\r\\n  .black:hover,\\r\\n  .black:active {\\r\\n    background: var(--color-black);\\r\\n    border-color: var(--color-black);\\r\\n    color: var(--color-white);\\r\\n  }\\r\\n\\r\\n  /* MAGENTA  */\\r\\n  .magenta {\\r\\n    background: inherit;\\r\\n    border-color: var(--color-magenta);\\r\\n    color: var(--color-magenta);\\r\\n  }\\r\\n  .magenta:hover,\\r\\n  .magenta:active {\\r\\n    background: var(--color-magenta);\\r\\n    border-color: var(--color-magenta);\\r\\n    color: var(--color-white);\\r\\n  }\\r\\n\\r\\n  /* CYAN  */\\r\\n  .cyan {\\r\\n    background: inherit;\\r\\n    border-color: var(--color-cyan);\\r\\n    color: var(--color-cyan);\\r\\n  }\\r\\n  .cyan:hover,\\r\\n  .cyan:active {\\r\\n    background: var(--color-cyan);\\r\\n    border-color: var(--color-cyan);\\r\\n    color: var(--color-white);\\r\\n  }\\r\\n\\r\\n  /* ORANGE  */\\r\\n  .orange {\\r\\n    background: inherit;\\r\\n    border-color: var(--color-orange);\\r\\n    color: var(--color-orange);\\r\\n  }\\r\\n  .orange:hover,\\r\\n  .orange:active {\\r\\n    background: var(--color-orange);\\r\\n    border-color: var(--color-orange);\\r\\n    color: var(--color-white);\\r\\n  }\\r\\n\\r\\n /* SUCCESS  */\\r\\n  .success {\\r\\n    background: inherit;\\r\\n    border-color: var(--color-success);\\r\\n    color: var(--color-success);\\r\\n  }\\r\\n  .success:hover,\\r\\n  .success:active {\\r\\n    background: var(--color-success);\\r\\n    border-color: var(--color-success);\\r\\n    color: var(--color-white);\\r\\n  }\\r\\n\\r\\n /* DANGER  */\\r\\n  .danger {\\r\\n    background: inherit;\\r\\n    border-color: var(--color-danger);\\r\\n    color: var(--color-danger);\\r\\n  }\\r\\n  .danger:hover,\\r\\n  .danger:active {\\r\\n    background: var(--color-danger);\\r\\n    border-color: var(--color-danger);\\r\\n    color: var(--color-white);\\r\\n  }\\r\\n\\r\\n\\r\\n  /* NEEDY */\\r\\n  .needy:before {\\r\\n\\t\\tcontent: '';\\r\\n\\t\\tposition: absolute;\\r\\n\\t\\ttop: 0; left: 0;\\r\\n\\t\\tz-index: 2;\\r\\n\\t\\t/* background: white; */\\r\\n\\t\\topacity: 0.6;\\r\\n\\t\\theight: 100%; width: 100%;\\r\\n\\t\\ttransform: skewX(-45deg);\\r\\n\\t\\tbackground: linear-gradient(to right, var(--color-white), var(--color-white) 20px, transparent 20px);\\r\\n\\t\\ttransform-origin: left bottom;\\r\\n\\t\\tanimation: shine 6s ease-in infinite;\\r\\n  }\\r\\n\\t@keyframes shine {\\r\\n\\t\\t0%   { transform: skewX(-45deg) translateX(-100%); }\\r\\n\\t\\t10%  { transform: skewX(-45deg) translateX(100%); }\\r\\n\\t\\t100% { transform: skewX(-45deg) translateX(100%); }\\r\\n\\t}\\r\\n\\r\\n  /* CLOSE */\\r\\n  .close {\\r\\n    background: transparent;\\r\\n    /* color: #cf0056; */\\r\\n    box-shadow: none;\\r\\n    padding: 0 0;\\r\\n    border-radius: 50%;\\r\\n    position: absolute;\\r\\n    top: 10px;\\r\\n    right: 10px;\\r\\n    width: 63px;\\r\\n    height: 63px;\\r\\n  }\\r\\n\\r\\n  .close:hover,\\r\\n  .close:active {\\r\\n    background: var(--color-black);\\r\\n    color: var(--color-white);\\r\\n    box-shadow: none;\\r\\n  }\\r\\n\\r\\n  .close:disabled,\\r\\n  .close:disabled:hover,\\r\\n  .close:disabled:active {\\r\\n    background: transparent;\\r\\n    color: var(--color-light);\\r\\n  }\\r\\n</style>\\r\\n\\r\\n{#if href}\\r\\n  <a class=\\\"{mode} {color}\\\" {href}>\\r\\n    <slot />\\r\\n  </a>\\r\\n{:else}\\r\\n  <button class=\\\"{mode} {color}\\\" {type} on:click {disabled}>\\r\\n    <slot />\\r\\n  </button>\\r\\n{/if}\\r\\n\"],\"names\":[],\"mappings\":\"AASE,qBAAM,CACN,CAAC,eAAC,CAAC,AACD,IAAI,CAAE,OAAO,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,CACpC,UAAU,CAAE,WAAW,CAEvB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,KAAK,CAAE,IAAI,aAAa,CAAC,CACzB,aAAa,CAAE,IAAI,eAAe,CAAC,CACnC,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,CAAC,CAC7C,MAAM,CAAE,OAAO,CACf,eAAe,CAAE,IAAI,CACrB,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CAId,QAAQ,CAAE,QAAQ,CAClB,QAAQ,CAAE,MAAM,AAClB,CAAC,AAGD,qBAAM,KAAK,cAAc,CAAC,CAC1B,gBAAC,KAAK,cAAc,CAAC,AAAC,CAAC,AACrB,sBAAsB,CAAE,CAAC,CACzB,yBAAyB,CAAE,CAAC,AAC9B,CAAC,AACD,qBAAM,KAAK,aAAa,CAAC,CACzB,gBAAC,KAAK,aAAa,CAAC,AAAC,CAAC,AACpB,uBAAuB,CAAE,CAAC,CAC1B,0BAA0B,CAAE,CAAC,AAC/B,CAAC,AAED,qBAAM,MAAM,AAAC,CAAC,AAAC,aAAa,CAAE,IAAI,AAAE,CAAC,AAErC,qBAAM,MAAM,CACZ,qBAAM,OAAO,CACb,gBAAC,MAAM,CACP,gBAAC,OAAO,AAAC,CAAC,AACR,UAAU,CAAE,IAAI,aAAa,CAAC,CAC9B,YAAY,CAAE,IAAI,aAAa,CAAC,CAChC,OAAO,CAAE,IAAI,AACf,CAAC,AAED,qBAAM,MAAM,CACZ,gBAAC,MAAM,AAAC,CAAC,AACP,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,CAAC,AAC/C,CAAC,AAED,qBAAM,OAAO,CACb,gBAAC,OAAO,AAAC,CAAC,AACR,UAAU,CAAE,KAAK,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,CAAC,AACrD,CAAC,AAED,qBAAM,SAAS,CACf,qBAAM,SAAS,MAAM,CACrB,qBAAM,SAAS,OAAO,AAAC,CAAC,AACtB,UAAU,CAAE,IAAI,aAAa,CAAC,CAC9B,YAAY,CAAE,IAAI,aAAa,CAAC,CAChC,KAAK,CAAE,IAAI,YAAY,CAAC,CACxB,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,WAAW,AACrB,CAAC,AAGD,MAAM,eAAC,CAAC,AACN,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,aAAa,CAAC,CAChC,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AACD,qBAAM,MAAM,CACZ,qBAAM,OAAO,AAAC,CAAC,AACb,UAAU,CAAE,IAAI,aAAa,CAAC,CAC9B,YAAY,CAAE,IAAI,aAAa,CAAC,CAChC,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AAGD,QAAQ,eAAC,CAAC,AACR,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,eAAe,CAAC,CAClC,KAAK,CAAE,IAAI,eAAe,CAAC,AAC7B,CAAC,AACD,uBAAQ,MAAM,CACd,uBAAQ,OAAO,AAAC,CAAC,AACf,UAAU,CAAE,IAAI,eAAe,CAAC,CAChC,YAAY,CAAE,IAAI,eAAe,CAAC,CAClC,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AAGD,KAAK,eAAC,CAAC,AACL,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,YAAY,CAAC,CAC/B,KAAK,CAAE,IAAI,YAAY,CAAC,AAC1B,CAAC,AACD,oBAAK,MAAM,CACX,oBAAK,OAAO,AAAC,CAAC,AACZ,UAAU,CAAE,IAAI,YAAY,CAAC,CAC7B,YAAY,CAAE,IAAI,YAAY,CAAC,CAC/B,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AAGD,OAAO,eAAC,CAAC,AACP,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,cAAc,CAAC,CACjC,KAAK,CAAE,IAAI,cAAc,CAAC,AAC5B,CAAC,AACD,sBAAO,MAAM,CACb,sBAAO,OAAO,AAAC,CAAC,AACd,UAAU,CAAE,IAAI,cAAc,CAAC,CAC/B,YAAY,CAAE,IAAI,cAAc,CAAC,CACjC,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AAGD,QAAQ,eAAC,CAAC,AACR,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,eAAe,CAAC,CAClC,KAAK,CAAE,IAAI,eAAe,CAAC,AAC7B,CAAC,AACD,uBAAQ,MAAM,CACd,uBAAQ,OAAO,AAAC,CAAC,AACf,UAAU,CAAE,IAAI,eAAe,CAAC,CAChC,YAAY,CAAE,IAAI,eAAe,CAAC,CAClC,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AAGD,OAAO,eAAC,CAAC,AACP,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,cAAc,CAAC,CACjC,KAAK,CAAE,IAAI,cAAc,CAAC,AAC5B,CAAC,AACD,sBAAO,MAAM,CACb,sBAAO,OAAO,AAAC,CAAC,AACd,UAAU,CAAE,IAAI,cAAc,CAAC,CAC/B,YAAY,CAAE,IAAI,cAAc,CAAC,CACjC,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC,AAID,qBAAM,OAAO,AAAC,CAAC,AACf,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CAAE,IAAI,CAAE,CAAC,CACf,OAAO,CAAE,CAAC,CAEV,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,IAAI,CAAE,KAAK,CAAE,IAAI,CACzB,SAAS,CAAE,MAAM,MAAM,CAAC,CACxB,UAAU,CAAE,gBAAgB,EAAE,CAAC,KAAK,CAAC,CAAC,IAAI,aAAa,CAAC,CAAC,CAAC,IAAI,aAAa,CAAC,CAAC,IAAI,CAAC,CAAC,WAAW,CAAC,IAAI,CAAC,CACpG,gBAAgB,CAAE,IAAI,CAAC,MAAM,CAC7B,SAAS,CAAE,oBAAK,CAAC,EAAE,CAAC,OAAO,CAAC,QAAQ,AACpC,CAAC,AACF,WAAW,oBAAM,CAAC,AACjB,EAAE,AAAG,CAAC,AAAC,SAAS,CAAE,MAAM,MAAM,CAAC,CAAC,WAAW,KAAK,CAAC,AAAE,CAAC,AACpD,GAAG,AAAE,CAAC,AAAC,SAAS,CAAE,MAAM,MAAM,CAAC,CAAC,WAAW,IAAI,CAAC,AAAE,CAAC,AACnD,IAAI,AAAC,CAAC,AAAC,SAAS,CAAE,MAAM,MAAM,CAAC,CAAC,WAAW,IAAI,CAAC,AAAE,CAAC,AACpD,CAAC,AAGA,MAAM,eAAC,CAAC,AACN,UAAU,CAAE,WAAW,CAEvB,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,CAAC,CAAC,CAAC,CACZ,aAAa,CAAE,GAAG,CAClB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACd,CAAC,AAED,qBAAM,MAAM,CACZ,qBAAM,OAAO,AAAC,CAAC,AACb,UAAU,CAAE,IAAI,aAAa,CAAC,CAC9B,KAAK,CAAE,IAAI,aAAa,CAAC,CACzB,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,qBAAM,SAAS,CACf,qBAAM,SAAS,MAAM,CACrB,qBAAM,SAAS,OAAO,AAAC,CAAC,AACtB,UAAU,CAAE,WAAW,CACvB,KAAK,CAAE,IAAI,aAAa,CAAC,AAC3B,CAAC\"}"
};

const Button = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { type = "button", href = null, mode = null, color = null, disabled = false } = $$props;

	if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
	if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
	if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);

	$$result.css.add(css);

	return `${ href ? `<a class="${escape(mode)} ${escape(color)} svelte-1ya8x44"${add_attribute("href", href, 0)}>
	    ${$$slots.default ? $$slots.default({}) : ``}
	  </a>` : `<button class="${escape(mode)} ${escape(color)} svelte-1ya8x44"${add_attribute("type", type, 0)}${disabled ? " disabled" : "" }>
	    ${$$slots.default ? $$slots.default({}) : ``}
	  </button>` }`;
});

/* src\components\UI\LogoSvg.svelte generated by Svelte v3.12.1 */

const css$1 = {
	code: ".logo.svelte-1xqg9dl{z-index:10;cursor:pointer}.fixed.svelte-1xqg9dl{position:fixed;top:10px;left:10px}.cls-2.svelte-1xqg9dl{fill:none;stroke-width:6px}.cls-2.bw.svelte-1xqg9dl{stroke:var(--color-black, #231f20)}.cls-1.svelte-1xqg9dl{fill-rule:evenodd}.cls-1.bw.svelte-1xqg9dl{fill:var(--color-black, #231f20)}",
	map: "{\"version\":3,\"file\":\"LogoSvg.svelte\",\"sources\":[\"LogoSvg.svelte\"],\"sourcesContent\":[\"<script>\\r\\n\\texport let animate = false;\\r\\n\\texport let ring = true;\\r\\n\\texport let style = \\\"gold\\\";\\r\\n\\texport let size = \\\"36\\\";\\r\\n\\texport let fixed = '';\\r\\n\\texport let time = 9;\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n\\t.logo {\\r\\n\\t\\tz-index: 10;\\r\\n\\t\\tcursor: pointer;\\r\\n\\t}\\r\\n\\t.fixed {\\r\\n\\t\\tposition: fixed;\\r\\n\\t\\ttop: 10px;\\r\\n\\t\\tleft: 10px;\\r\\n\\t}\\r\\n\\r\\n\\t.cls-2 {\\r\\n\\t\\tfill: none;\\r\\n\\t\\tstroke-width: 6px;\\r\\n\\t}\\r\\n\\t.cls-2.bw { stroke: var(--color-black, #231f20); }\\r\\n\\t.cls-1 { fill-rule: evenodd; }\\r\\n\\t.cls-1.bw { fill: var(--color-black, #231f20); }\\r\\n</style>\\r\\n\\r\\n<svg class=\\\"logo {fixed}\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" xmlns:xlink=\\\"http://www.w3.org/1999/xlink\\\" viewBox=\\\"0 0 220 220\\\" width=\\\"{size}\\\" height=\\\"{size}\\\" on:click>\\r\\n\\t<defs>\\r\\n\\t\\t<!-- Da gradient -->\\r\\n\\t\\t<linearGradient id=\\\"gradient\\\" x1=\\\"0%\\\" y1=\\\"0%\\\" x2=\\\"100%\\\" y2=\\\"0\\\">\\r\\n\\t\\t\\t<stop offset=\\\"0%\\\" style=\\\"stop-color:#8d755d;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"12%\\\" style=\\\"stop-color:#b1872d;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"36%\\\" style=\\\"stop-color:#faf394;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"50%\\\" style=\\\"stop-color:#8d755d;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"64%\\\" style=\\\"stop-color:#ceaa41;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"76%\\\" style=\\\"stop-color:#faf394;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"88%\\\" style=\\\"stop-color:#b1872d;\\\"/>\\r\\n\\t\\t\\t<stop offset=\\\"100%\\\" style=\\\"stop-color:#8d755d;\\\"/>\\r\\n\\t\\t</linearGradient>\\r\\n\\r\\n\\t\\t<pattern id=\\\"pattern\\\" x=\\\"0\\\" y=\\\"0\\\" width=\\\"220%\\\" height=\\\"220%\\\" patternUnits=\\\"userSpaceOnUse\\\">\\r\\n\\t\\t\\t<circle cx=\\\"110\\\" cy=\\\"110\\\" r=\\\"106.5\\\" fill=\\\"url(#gradient)\\\">\\r\\n\\t\\t\\t\\t<animateTransform  attributeType=\\\"XML\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t attributeName=\\\"transform\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t type=\\\"rotate\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t from=\\\"0\\\" to=\\\"360\\\" begin=\\\"0\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t dur=\\\"{time}s\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t repeatCount=\\\"{animate ? 'indefinite' : 0}\\\"/>\\r\\n\\t\\t\\t</circle>\\r\\n\\t\\t\\t<circle cx=\\\"110\\\" cy=\\\"110\\\" r=\\\"106.5\\\" fill=\\\"url(#gradient)\\\">\\r\\n\\t\\t\\t\\t<animateTransform  attributeType=\\\"XML\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t attributeName=\\\"transform\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t type=\\\"rotate\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t from=\\\"360\\\" to=\\\"0\\\" begin=\\\"360\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t dur=\\\"{time}s\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t repeatCount=\\\"{animate ? 'indefinite' : 0}\\\"/>\\r\\n\\t\\t\\t</circle>\\r\\n\\t\\t\\t<rect x=\\\"0\\\" y=\\\"0\\\" width=\\\"220%\\\" height=\\\"220%\\\" fill=\\\"url(#gradient)\\\">\\r\\n\\t\\t\\t\\t<animate attributeType=\\\"XML\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t attributeName=\\\"x\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t from=\\\"0\\\" to=\\\"220%\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t dur=\\\"{time}s\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t repeatCount=\\\"{animate ? 'indefinite' : 0}\\\"/>\\r\\n\\t\\t\\t</rect>\\r\\n\\t\\t\\t<rect x=\\\"-220%\\\" y=\\\"0\\\" width=\\\"220%\\\" height=\\\"220%\\\" fill=\\\"url(#gradient)\\\">\\r\\n\\t\\t\\t\\t<animate attributeType=\\\"XML\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t attributeName=\\\"x\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t from=\\\"-220%\\\" to=\\\"0\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t dur=\\\"{time}s\\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t repeatCount=\\\"{animate ? 'indefinite' : 0}\\\"/>\\r\\n\\t\\t\\t</rect>\\r\\n\\t\\t</pattern>\\r\\n\\t</defs>\\r\\n\\t<title>CariariRealty</title>\\r\\n\\t<g id=\\\"bat\\\" fill=\\\"url(#pattern)\\\">\\r\\n\\t\\t<path class=\\\"cls-1 {style}\\\" d=\\\"M182.2,173.8c.7,2.6.4,6.2-1.9,8.5s-7.2,2.1-12.5.9a104.3,104.3,0,0,1-14.4-4.7c-10.1-5.5-25.3-8.3-42.4-9.5-17.1,1.2-32.3,4-42.4,9.5a104.3,104.3,0,0,1-14.4,4.7c-5.3,1.2-9.8,1.6-12.5-.9s-2.6-5.9-1.9-8.5c1.6-6.5,9.4-9.5,13.4-11.4s15.1-10.9,24.1-19.8,12.3-17.2,19.3-28.3c1.4-2.3,4.6-7.4,2.9-12.3-1.1-2.7-3.8-5.7-6.8-5.6s-3.6,1.5-4.8,2.8-4,4.4-5.8,6.6A97.2,97.2,0,0,0,60.9,83.1,99.5,99.5,0,0,0,37.8,69.9a18.3,18.3,0,0,1,9.7-8.5c3.2-1.1,7.3-1.2,13.4,1,9.1,3.3,14.9,9.2,24.1,16,4.6,3.5,8.5,5.8,12.5,4.7s8.9-7,7.7-12.2a9.1,9.1,0,0,0-3.8-5.7c-3.6-2.5-8.7-1.1-10.6-3.8s.4-4.6-1-7.5A10.2,10.2,0,0,0,86,50.1a13.4,13.4,0,0,0-6.8-1.9c2.3-3.4,4.5-6.9,6.8-10.4a28,28,0,0,0,6.7,4.7A34,34,0,0,0,111,46.3a34,34,0,0,0,18.3-3.8,28,28,0,0,0,6.7-4.7c2.3,3.5,4.5,7,6.8,10.4a13.4,13.4,0,0,0-6.8,1.9,10.2,10.2,0,0,0-3.8,3.8c-1.4,2.9.5,5.4-1,7.5s-6.9,1.3-10.6,3.8a9.6,9.6,0,0,0-3.8,5.7c-1.2,5.2,3,11,7.7,12.2s7.9-1.2,12.5-4.7c9.2-6.8,15-12.7,24.1-16,6.1-2.2,10.2-2.1,13.4-1a18.3,18.3,0,0,1,9.7,8.5,99.5,99.5,0,0,0-23.1,13.2,97.2,97.2,0,0,0-21.2,22.7c-1.8-2.2-3.7-4.4-5.8-6.6s-2.7-2.8-4.8-2.8-5.7,2.9-6.8,5.6c-1.7,4.9,1.5,10,2.9,12.3,7,11.1,10.5,19.7,19.3,28.3s19.3,17.7,24.1,19.8S180.6,167.3,182.2,173.8Z\\\" transform=\\\"translate(-1 -1)\\\"/>\\r\\n\\t</g>\\r\\n\\t{#if ring}\\r\\n\\t<g id=\\\"ring\\\" stroke=\\\"url(#pattern)\\\">\\r\\n\\t\\t<circle class=\\\"cls-2 {style}\\\" cx=\\\"110\\\" cy=\\\"110\\\" r=\\\"106.5\\\"/>\\r\\n\\t</g>\\r\\n\\t{/if}\\r\\n</svg>\"],\"names\":[],\"mappings\":\"AAUC,KAAK,eAAC,CAAC,AACN,OAAO,CAAE,EAAE,CACX,MAAM,CAAE,OAAO,AAChB,CAAC,AACD,MAAM,eAAC,CAAC,AACP,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,IAAI,CACT,IAAI,CAAE,IAAI,AACX,CAAC,AAED,MAAM,eAAC,CAAC,AACP,IAAI,CAAE,IAAI,CACV,YAAY,CAAE,GAAG,AAClB,CAAC,AACD,MAAM,GAAG,eAAC,CAAC,AAAC,MAAM,CAAE,IAAI,aAAa,CAAC,QAAQ,CAAC,AAAE,CAAC,AAClD,MAAM,eAAC,CAAC,AAAC,SAAS,CAAE,OAAO,AAAE,CAAC,AAC9B,MAAM,GAAG,eAAC,CAAC,AAAC,IAAI,CAAE,IAAI,aAAa,CAAC,QAAQ,CAAC,AAAE,CAAC\"}"
};

const LogoSvg = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { animate = false, ring = true, style = "gold", size = "36", fixed = '', time = 9 } = $$props;

	if ($$props.animate === void 0 && $$bindings.animate && animate !== void 0) $$bindings.animate(animate);
	if ($$props.ring === void 0 && $$bindings.ring && ring !== void 0) $$bindings.ring(ring);
	if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.fixed === void 0 && $$bindings.fixed && fixed !== void 0) $$bindings.fixed(fixed);
	if ($$props.time === void 0 && $$bindings.time && time !== void 0) $$bindings.time(time);

	$$result.css.add(css$1);

	return `<svg class="logo ${escape(fixed)} svelte-1xqg9dl" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 220 220"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)}>
		<defs>

			<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0">
				<stop offset="0%" style="stop-color:#8d755d;"></stop>
				<stop offset="12%" style="stop-color:#b1872d;"></stop>
				<stop offset="36%" style="stop-color:#faf394;"></stop>
				<stop offset="50%" style="stop-color:#8d755d;"></stop>
				<stop offset="64%" style="stop-color:#ceaa41;"></stop>
				<stop offset="76%" style="stop-color:#faf394;"></stop>
				<stop offset="88%" style="stop-color:#b1872d;"></stop>
				<stop offset="100%" style="stop-color:#8d755d;"></stop>
			</linearGradient>

			<pattern id="pattern" x="0" y="0" width="220%" height="220%" patternUnits="userSpaceOnUse">
				<circle cx="110" cy="110" r="106.5" fill="url(#gradient)">
					<animateTransform attributeType="XML" attributeName="transform" type="rotate" from="0" to="360" begin="0" dur="${escape(time)}s"${add_attribute("repeatCount", animate ? 'indefinite' : 0, 0)}></animateTransform>
				</circle>
				<circle cx="110" cy="110" r="106.5" fill="url(#gradient)">
					<animateTransform attributeType="XML" attributeName="transform" type="rotate" from="360" to="0" begin="360" dur="${escape(time)}s"${add_attribute("repeatCount", animate ? 'indefinite' : 0, 0)}></animateTransform>
				</circle>
				<rect x="0" y="0" width="220%" height="220%" fill="url(#gradient)">
					<animate attributeType="XML" attributeName="x" from="0" to="220%" dur="${escape(time)}s"${add_attribute("repeatCount", animate ? 'indefinite' : 0, 0)}></animate>
				</rect>
				<rect x="-220%" y="0" width="220%" height="220%" fill="url(#gradient)">
					<animate attributeType="XML" attributeName="x" from="-220%" to="0" dur="${escape(time)}s"${add_attribute("repeatCount", animate ? 'indefinite' : 0, 0)}></animate>
				</rect>
			</pattern>
		</defs>
		<title>CariariRealty</title>
		<g id="bat" fill="url(#pattern)">
			<path class="cls-1 ${escape(style)} svelte-1xqg9dl" d="M182.2,173.8c.7,2.6.4,6.2-1.9,8.5s-7.2,2.1-12.5.9a104.3,104.3,0,0,1-14.4-4.7c-10.1-5.5-25.3-8.3-42.4-9.5-17.1,1.2-32.3,4-42.4,9.5a104.3,104.3,0,0,1-14.4,4.7c-5.3,1.2-9.8,1.6-12.5-.9s-2.6-5.9-1.9-8.5c1.6-6.5,9.4-9.5,13.4-11.4s15.1-10.9,24.1-19.8,12.3-17.2,19.3-28.3c1.4-2.3,4.6-7.4,2.9-12.3-1.1-2.7-3.8-5.7-6.8-5.6s-3.6,1.5-4.8,2.8-4,4.4-5.8,6.6A97.2,97.2,0,0,0,60.9,83.1,99.5,99.5,0,0,0,37.8,69.9a18.3,18.3,0,0,1,9.7-8.5c3.2-1.1,7.3-1.2,13.4,1,9.1,3.3,14.9,9.2,24.1,16,4.6,3.5,8.5,5.8,12.5,4.7s8.9-7,7.7-12.2a9.1,9.1,0,0,0-3.8-5.7c-3.6-2.5-8.7-1.1-10.6-3.8s.4-4.6-1-7.5A10.2,10.2,0,0,0,86,50.1a13.4,13.4,0,0,0-6.8-1.9c2.3-3.4,4.5-6.9,6.8-10.4a28,28,0,0,0,6.7,4.7A34,34,0,0,0,111,46.3a34,34,0,0,0,18.3-3.8,28,28,0,0,0,6.7-4.7c2.3,3.5,4.5,7,6.8,10.4a13.4,13.4,0,0,0-6.8,1.9,10.2,10.2,0,0,0-3.8,3.8c-1.4,2.9.5,5.4-1,7.5s-6.9,1.3-10.6,3.8a9.6,9.6,0,0,0-3.8,5.7c-1.2,5.2,3,11,7.7,12.2s7.9-1.2,12.5-4.7c9.2-6.8,15-12.7,24.1-16,6.1-2.2,10.2-2.1,13.4-1a18.3,18.3,0,0,1,9.7,8.5,99.5,99.5,0,0,0-23.1,13.2,97.2,97.2,0,0,0-21.2,22.7c-1.8-2.2-3.7-4.4-5.8-6.6s-2.7-2.8-4.8-2.8-5.7,2.9-6.8,5.6c-1.7,4.9,1.5,10,2.9,12.3,7,11.1,10.5,19.7,19.3,28.3s19.3,17.7,24.1,19.8S180.6,167.3,182.2,173.8Z" transform="translate(-1 -1)"></path>
		</g>
		${ ring ? `<g id="ring" stroke="url(#pattern)">
			<circle class="cls-2 ${escape(style)} svelte-1xqg9dl" cx="110" cy="110" r="106.5"></circle>
		</g>` : `` }
	</svg>`;
});

const base = 'https://svelte-meetups-course.firebaseio.com';

function send({ method, path, data, token }) {
	const fetch =  require('node-fetch').default;

	const opts = { method, headers: {} };

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Token ${token}`;
	}

	return fetch(`${base}/${path}`, opts)
		.then(r => r.text())
		.then(json => {
			try {
				return JSON.parse(json);
			} catch (err) {
				return json;
			}
		});
}

function get(path, token) {
	return send({ method: 'GET', path, token });
}

exports.Button = Button;
exports.LogoSvg = LogoSvg;
exports.add_attribute = add_attribute;
exports.afterUpdate = afterUpdate;
exports.createEventDispatcher = createEventDispatcher;
exports.create_ssr_component = create_ssr_component;
exports.each = each;
exports.escape = escape;
exports.get = get;
exports.getContext = getContext;
exports.get_store_value = get_store_value;
exports.missing_component = missing_component;
exports.null_to_empty = null_to_empty;
exports.onDestroy = onDestroy;
exports.onMount = onMount;
exports.setContext = setContext;
exports.validate_component = validate_component;
exports.writable = writable;
