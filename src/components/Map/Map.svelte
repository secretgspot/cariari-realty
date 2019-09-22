<script>
  import { onMount, createEventDispatcher, setContext } from "svelte";
  import { contextKey } from "./mapbox.js";

  setContext(contextKey, {
    getMap: () => map,
    getMapbox: () => mapbox
  });

  const dispatch = createEventDispatcher();

  let container;
  let map;
  let mapbox;
  export let options = {};
  export let accessToken;
  export let style = "mapbox://styles/secretgspot/ck0n5b47v098x1co2yrdd57i5";

  // export let bounds = [
  //   [-84.15194476346613, 9.962904177097485], // SW
  //   [-84.16587277728922, 9.972644094689585] // NE
  // ]; // maxBounds

  export function setMaxBounds(bounds) {
    if (map) {
      map.setMaxBounds(bounds);
    }
  };

  export function setCenter(center, zoom, minzoom, maxzoom) {
    if (map) {
      map.setCenter(center);
      if (zoom && Number.isInteger(zoom)) {
        map.setZoom(zoom);
      }
      if (minzoom && Number.isInteger(minzoom)) {
        map.setMinZoom(minzoom);
      }
      if (maxzoom && Number.isInteger(maxzoom)) {
        map.setMaxZoom(maxzoom);
      }
    }
  }

  export function resize() {
    map && map.resize();
  }

  onMount(async () => {
    const mapboxModule = await import("mapbox-gl");
    mapbox = mapboxModule.default;
    mapbox.accessToken = accessToken;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/mapbox-gl/dist/mapbox-gl.css";
    let el;
    link.onload = () => {
      el = new mapbox.Map({
        container,
        style,
        ...options
      });
      el.on("dragend", () => dispatch("recentre", { center: el.getCenter() }));
      el.on("load", () => {
        map = el;
        dispatch("ready");
      });
    };
    document.head.appendChild(link);
    return () => {
      map.remove();
      link.parentNode.removeChild(link);
    };
  });
</script>

<style>
  .map-wrapper {
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
    width: 100%;
    height: 100%;
  }
</style>

<div class="map-wrapper" bind:this="{container}">
  {#if map}
    <slot />
  {/if}
</div>
