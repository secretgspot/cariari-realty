<script>
  import { getContext, onMount } from 'svelte';
	import { contextKey } from './components.js';

	const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();

  export let propertiesData;

	var storesProperties = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#2b58d2",
          "msl": "CRc-001"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16924238204956,
            9.973838124637682
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#24d94d",
          "msl": "CRc-002"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16720390319823,
            9.970435632527144
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#fd0006",
          "msl": "CRc-003"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16576623916626,
            9.970224296441677
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#f1b80c",
          "msl": "CRc-004"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16941404342651,
            9.971080206741435
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#15e8dd",
          "msl": "CRc-005"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16905999183655,
            9.972570119308381
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#d314e9",
          "msl": "CRc-006"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16700005531311,
            9.97325695614096
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.14960861206055,
            9.972696920063367
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.15553092956543,
            9.980156944278768
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16160345077513,
            9.977790042920075
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.15377140045166,
            9.974155125198955
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.15881395339966,
            9.968153195552807
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.15950059890747,
            9.972020648799964
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16900634765625,
            9.976881317292591
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16205406188965,
            9.967286710664585
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16754722595213,
            9.967202175430245
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.14917945861816,
            9.965173323230804
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.14823532104492,
            9.969019678137975
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.16497230529785,
            9.979332757365112
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.17080879211424,
            9.975528790733517
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -84.15802001953125,
            9.982333633019568
          ]
        }
      }
    ]
  };

  // Add a new source from our GeoJSON data and set the
  // 'cluster' option to true. GL-JS will add the point_count property to your source data.
  map.addSource("properties", {
    type: "geojson",
    // Point to GeoJSON data.
    data: storesProperties
	});

  map.addLayer({
    id: "marker",
    source: "properties",
    type: "circle",
    paint: {
      "circle-color": "transparent",
      "circle-radius": 12,
      "circle-stroke-width": 3,
      "circle-stroke-color": {
        property: "marker-color",
        type: "identity"
      }
    }
	});


  map.on('click', 'marker', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var msl = e.features[0].properties.msl;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      map.setCenter(coordinates);

      new mapbox.Popup({})
        .setLngLat(coordinates)
        .setHTML(`<h1>${msl}</h1>`)
        .addTo(map);
      //alert('Clicked Marker')
			// console.log(e.features[0].properties.phone)
	});

  map.on('mouseenter', 'marker', function () {
      map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'marker', function () {
      map.getCanvas().style.cursor = '';
	});
</script>
