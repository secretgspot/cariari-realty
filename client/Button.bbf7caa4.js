import{D as e,S as s,i as t,s as l,p as o,l as r,B as a,b as d,C as c,t as n,k as i,F as p,c as u,e as h,f,h as $,r as b,G as m,g as y,a as v}from"./index.46569a62.js";const x=e([]),P={subscribe:x.subscribe,setProperties:e=>{x.set(e)},addProperty:e=>{const s={...e};x.update(e=>[s,...e])},updateProperty:(e,s)=>{x.update(t=>{const l=t.findIndex(s=>s.id===e),o={...t[l],...s},r=[...t];return r[l]=o,r})},removeProperty:e=>{x.update(s=>s.filter(s=>s.id!==e))},toggleProperty:e=>{x.update(s=>{const t={...s.find(s=>s.id===e)};t.is_active=!t.is_active;const l=s.findIndex(s=>s.id===e),o=[...s];return o[l]=t,o})}};function k(e){var s,t,l,o;const a=e.$$slots.default,c=u(a,e,null);return{c(){s=h("button"),c&&c.c(),this.h()},l(e){s=f(e,"BUTTON",{class:!0,type:!0,disabled:!0},!1);var t=$(s);c&&c.l(t),t.forEach(i),this.h()},h(){b(s,"class",t=e.mode+" "+e.color+" svelte-2hreat"),b(s,"type",e.type),s.disabled=e.disabled,o=m(s,"click",e.click_handler)},m(e,t){r(e,s,t),c&&c.m(s,null),l=!0},p(e,o){c&&c.p&&e.$$scope&&c.p(y(a,o,e,null),v(a,o,null)),l&&!e.mode&&!e.color||t===(t=o.mode+" "+o.color+" svelte-2hreat")||b(s,"class",t),l&&!e.type||b(s,"type",o.type),l&&!e.disabled||(s.disabled=o.disabled)},i(e){l||(n(c,e),l=!0)},o(e){d(c,e),l=!1},d(e){e&&i(s),c&&c.d(e),o()}}}function _(e){var s,t;const l=e.$$slots.default,o=u(l,e,null);return{c(){s=h("a"),o&&o.c(),this.h()},l(e){s=f(e,"A",{href:!0,class:!0},!1);var t=$(s);o&&o.l(t),t.forEach(i),this.h()},h(){b(s,"href",e.href),b(s,"class","svelte-2hreat")},m(e,l){r(e,s,l),o&&o.m(s,null),t=!0},p(e,r){o&&o.p&&e.$$scope&&o.p(y(l,r,e,null),v(l,r,null)),t&&!e.href||b(s,"href",r.href)},i(e){t||(n(o,e),t=!0)},o(e){d(o,e),t=!1},d(e){e&&i(s),o&&o.d(e)}}}function g(e){var s,t,l,p,u=[_,k],h=[];function f(e,s){return s.href?0:1}return s=f(0,e),t=h[s]=u[s](e),{c(){t.c(),l=o()},l(e){t.l(e),l=o()},m(e,t){h[s].m(e,t),r(e,l,t),p=!0},p(e,o){var r=s;(s=f(0,o))===r?h[s].p(e,o):(a(),d(h[r],1,1,()=>{h[r]=null}),c(),(t=h[s])||(t=h[s]=u[s](o)).c(),n(t,1),t.m(l.parentNode,l))},i(e){p||(n(t),p=!0)},o(e){d(t),p=!1},d(e){h[s].d(e),e&&i(l)}}}function B(e,s,t){let{type:l="button",href:o=null,mode:r=null,color:a=null,disabled:d=!1}=s,{$$slots:c={},$$scope:n}=s;return e.$set=(e=>{"type"in e&&t("type",l=e.type),"href"in e&&t("href",o=e.href),"mode"in e&&t("mode",r=e.mode),"color"in e&&t("color",a=e.color),"disabled"in e&&t("disabled",d=e.disabled),"$$scope"in e&&t("$$scope",n=e.$$scope)}),{type:l,href:o,mode:r,color:a,disabled:d,click_handler:function(s){p(e,s)},$$slots:c,$$scope:n}}class E extends s{constructor(e){super(),t(this,e,B,g,l,["type","href","mode","color","disabled"])}}export{E as B,P as p};
