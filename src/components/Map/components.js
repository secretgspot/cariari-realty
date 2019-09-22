'use strict'

import Map from './Map.svelte';
import { contextKey } from './mapbox.js';
import NavigationControl from './NavigationControl.svelte';
import ScalingControl from './ScalingControl.svelte';
import GeolocateControl from './GeolocateControl.svelte';

const controls = {
  NavigationControl,
  ScalingControl,
  GeolocateControl
}

export {
  Map,
  contextKey,
  controls
}