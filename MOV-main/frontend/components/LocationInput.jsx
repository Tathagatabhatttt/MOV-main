import { useEffect, useState } from "react";
import { MAPBOX_TOKEN } from "../mapbox";

export default function LocationInput({ label, value, onSelect }) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return setResults([]);

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}&limit=5`
    )
      .then(res => res.json())
      .then(d => setResults(d.features || []));
  }, [query]);

  return (
    <div style={{ marginBottom: 12 }}>
      <input
        placeholder={label}
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: "100%", padding: 12 }}
      />

      {results.map(p => (
        <div
          key={p.id}
          onClick={() => {
            const place = {
              name: p.place_name,
              coords: p.center
            };
            setQuery(p.place_name);
            setResults([]);
            onSelect(place);
          }}
          style={{ padding: 8, cursor: "pointer" }}
        >
          {p.place_name}
        </div>
      ))}
    </div>
  );
}
