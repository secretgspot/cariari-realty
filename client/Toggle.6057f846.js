import{D as e,S as a,i as l,s,e as c,o as r,d,f as t,h,k as b,p as n,j as i,q as o,r as u,l as g,m as k,n as v,J as f,G as p,T as _}from"./LogoSvg.cd59233e.js";let A=e(!1),w=0;const E=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];function L(e){E.indexOf(e.key)<0||e.key!==E[w]?w=0:(w++,E.length===w&&(w=0,A.set(!0)))}function S(e){var a,l,s,_,A,w,E,L,S,m;return{c(){a=c("div"),l=c("label"),s=c("input"),_=r(),A=c("span"),w=c("span"),E=r(),L=c("span"),S=d(e.label),this.h()},l(c){a=t(c,"DIV",{class:!0},!1);var r=h(a);l=t(r,"LABEL",{class:!0},!1);var d=h(l);s=t(d,"INPUT",{class:!0,type:!0,value:!0,disabled:!0},!1),h(s).forEach(b),_=n(d),A=t(d,"SPAN",{class:!0},!1);var o=h(A);w=t(o,"SPAN",{class:!0},!1),h(w).forEach(b),o.forEach(b),E=n(d),L=t(d,"SPAN",{class:!0},!1);var u=h(L);S=i(u,e.label),u.forEach(b),d.forEach(b),r.forEach(b),this.h()},h(){o(s,"class","toggle-input svelte-2bbr3u"),o(s,"type","checkbox"),s.__value=e.label,s.value=s.__value,s.disabled=e.disabled,o(w,"class","toggle-switch svelte-2bbr3u"),o(A,"class","toggle-track svelte-2bbr3u"),o(L,"class","toggle-title svelte-2bbr3u"),o(l,"class","toggle-label svelte-2bbr3u"),o(a,"class","toggle svelte-2bbr3u"),m=[u(s,"change",e.input_change_handler),u(s,"change",e.change_handler)]},m(c,r){g(c,a,r),k(a,l),k(l,s),s.checked=e.checked,k(l,_),k(l,A),k(A,w),k(l,E),k(l,L),k(L,S)},p(e,a){e.checked&&(s.checked=a.checked),e.label&&(s.__value=a.label),s.value=s.__value,e.disabled&&(s.disabled=a.disabled),e.label&&v(S,a.label)},i:f,o:f,d(e){e&&b(a),p(m)}}}function m(e,a,l){let{checked:s=!1,label:c="Checked",disabled:r=!1}=a;return e.$set=(e=>{"checked"in e&&l("checked",s=e.checked),"label"in e&&l("label",c=e.label),"disabled"in e&&l("disabled",r=e.disabled)}),{checked:s,label:c,disabled:r,change_handler:function(a){_(e,a)},input_change_handler:function(){s=this.checked,l("checked",s)}}}class x extends a{constructor(e){super(),l(this,e,m,S,s,["checked","label","disabled"])}}export{x as T,A as i,L as k};
