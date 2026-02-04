import { useEffect, useState } from "react";

export default function useLiveLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      pos =>
        setLocation([
          pos.coords.longitude,
          pos.coords.latitude
        ]),
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { location };
}
