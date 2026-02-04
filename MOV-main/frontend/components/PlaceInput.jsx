import { useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../mapbox";

export default function PlaceInput({ placeholder, onSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl,
      placeholder,
      marker: false
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(geocoder.onAdd());

    geocoder.on("result", e => {
      onSelect(e.result.center);
    });

    return () => {
      geocoder.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full mb-3"
    />
  );
}
