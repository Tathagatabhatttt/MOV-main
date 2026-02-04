import { MAPBOX_TOKEN } from "../mapbox";

export async function geocode(place) {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      place
    )}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await res.json();
  return data.features[0].center; // [lng, lat]
}

export async function getRoute(from, to) {
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
  );
  const data = await res.json();
  return data.routes[0];
}
