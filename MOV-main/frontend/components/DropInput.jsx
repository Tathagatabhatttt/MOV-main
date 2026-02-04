import { useEffect, useState } from "react";
import { MAPBOX_TOKEN } from "../mapbox";

export default function DropInput({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
    )
      .then(res => res.json())
      .then(data => setResults(data.features || []))
      .catch(() => {});

    return () => controller.abort();
  }, [query]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Where to?"
        className="w-full p-3 rounded-xl border mb-1"
      />

      {results.length > 0 && (
        <div className="absolute z-10 w-full bg-white rounded-xl shadow">
          {results.map(place => (
            <div
              key={place.id}
              onClick={() => {
                setQuery(place.place_name);
                setResults([]);
                onSelect(place.center);
              }}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {place.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
