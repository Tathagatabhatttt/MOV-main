import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your actual Mapbox token
mapboxgl.accessToken = "pk.eyJ1IjoidGF0aGFnYXRhMzEiLCJhIjoiY203dGZpeG9qMHFhbzJqcjJkdHRydm8xeCJ9.B7l1dHUjVmPieh7VEBSd5w";

export default function MapView({ pickup, drop }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const pickupMarker = useRef(null);
  const dropMarker = useRef(null);
  
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  // Default to Chennai coordinates as fallback
  const defaultCenter = [80.2707, 13.0827];

  // Get user's real-time location
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Request user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);
          console.log("✅ User location obtained:", coords);
        },
        (error) => {
          console.error("❌ Geolocation error:", error);
          setLocationError(error.message);
          // Use default location
          setUserLocation(defaultCenter);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      // Watch for location changes (real-time tracking)
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);
          
          // Update user marker position if it exists
          if (userMarker.current && map.current) {
            userMarker.current.setLngLat(coords);
          }
        },
        (error) => {
          console.error("❌ Location watch error:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.warn("⚠️ Geolocation not supported");
      setUserLocation(defaultCenter);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const initialCenter = userLocation || defaultCenter;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenter,
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
      showUserLocation: true
    });
    
    map.current.addControl(geolocateControl, "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  // Add/update user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create pulsing blue dot for user location
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        animation: pulse-location 2s infinite;
      "></div>
    `;

    userMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<p style="margin: 0; padding: 8px;"><strong>Your Location</strong></p>`))
      .addTo(map.current);

    // Center map on user location
    map.current.flyTo({
      center: userLocation,
      zoom: 14,
      duration: 1000
    });

  }, [userLocation]);

  // Handle pickup/drop markers with geocoding
  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Remove existing pickup/drop markers
    if (pickupMarker.current) pickupMarker.current.remove();
    if (dropMarker.current) dropMarker.current.remove();

    // Remove existing route
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    if (pickup && drop) {
      // Use Mapbox Geocoding API with Chennai bounding box restriction
      const geocodeAddress = async (address, type) => {
        try {
          // Chennai bounding box: [minLon, minLat, maxLon, maxLat]
          const chennaiBbox = [80.1, 12.9, 80.3, 13.2];
          
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address + " Chennai")}.json?` +
            `access_token=${mapboxgl.accessToken}` +
            `&proximity=${userLocation[0]},${userLocation[1]}` +
            `&bbox=${chennaiBbox.join(',')}` +
            `&limit=1` +
            `&country=IN` // Restrict to India
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const coords = data.features[0].center;
            console.log(`✅ Geocoded ${type}: ${address} → [${coords[0]}, ${coords[1]}]`);
            return coords;
          }
          
          // Fallback to user location with small offset
          console.warn(`⚠️ Geocoding failed for ${address}, using fallback`);
          const offset = type === 'pickup' ? -0.015 : 0.015;
          return [userLocation[0] + offset, userLocation[1] + offset];
          
        } catch (error) {
          console.error(`❌ Geocoding error for ${type}:`, error);
          const offset = type === 'pickup' ? -0.015 : 0.015;
          return [userLocation[0] + offset, userLocation[1] + offset];
        }
      };

      // Geocode and add markers
      Promise.all([
        geocodeAddress(pickup, 'pickup'),
        geocodeAddress(drop, 'drop')
      ]).then(async ([pickupCoords, dropCoords]) => {
        
        // Validate coordinates are in Chennai area
        const isInChennai = (coords) => {
          const [lon, lat] = coords;
          return lon >= 80.1 && lon <= 80.35 && lat >= 12.9 && lat <= 13.25;
        };

        // Use user location or Chennai center if coordinates are invalid
        const validPickup = isInChennai(pickupCoords) ? pickupCoords : 
          [userLocation[0] - 0.015, userLocation[1] - 0.015];
        const validDrop = isInChennai(dropCoords) ? dropCoords : 
          [userLocation[0] + 0.015, userLocation[1] + 0.015];

        console.log('📍 Using coordinates:', { pickup: validPickup, drop: validDrop });

        // Add pickup marker (green)
        pickupMarker.current = new mapboxgl.Marker({ color: "#10b981" })
          .setLngLat(validPickup)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div style="padding: 8px;">
              <strong style="color: #10b981;">Pickup</strong><br/>
              ${pickup}
            </div>
          `))
          .addTo(map.current);

        // Add drop marker (red)
        dropMarker.current = new mapboxgl.Marker({ color: "#ef4444" })
          .setLngLat(validDrop)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div style="padding: 8px;">
              <strong style="color: #ef4444;">Drop</strong><br/>
              ${drop}
            </div>
          `))
          .addTo(map.current);

        // Get actual driving route from Mapbox Directions API
        try {
          const directionsResponse = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/` +
            `${validPickup[0]},${validPickup[1]};${validDrop[0]},${validDrop[1]}?` +
            `access_token=${mapboxgl.accessToken}` +
            `&geometries=geojson` +
            `&overview=full`
          );
          const directionsData = await directionsResponse.json();

          if (directionsData.routes && directionsData.routes.length > 0) {
            const route = directionsData.routes[0];
            const routeGeometry = route.geometry;

            // Calculate distance and duration
            const distanceKm = (route.distance / 1000).toFixed(1);
            const durationMin = Math.round(route.duration / 60);

            console.log(`🚗 Route: ${distanceKm}km, ${durationMin} mins`);

            // Add route line with actual path
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {
                  distance: distanceKm,
                  duration: durationMin
                },
                geometry: routeGeometry
              }
            });

            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3B82F6',
                'line-width': 5,
                'line-opacity': 0.8
              }
            });

          } else {
            // Fallback to straight line if directions fail
            console.warn('⚠️ No route found, using straight line');
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [validPickup, validDrop]
                }
              }
            });

            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3B82F6',
                'line-width': 4,
                'line-opacity': 0.75,
                'line-dasharray': [2, 2] // Dashed line for straight fallback
              }
            });
          }
        } catch (error) {
          console.error('❌ Directions API error:', error);
          // Fallback to straight line
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [validPickup, validDrop]
              }
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3B82F6',
              'line-width': 4,
              'line-opacity': 0.75
            }
          });
        }

        // Fit map to show all markers (within Chennai bounds)
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(validPickup);
        bounds.extend(validDrop);
        
        // Add padding based on distance between points
        const distance = Math.sqrt(
          Math.pow(validDrop[0] - validPickup[0], 2) + 
          Math.pow(validDrop[1] - validPickup[1], 2)
        );
        const padding = distance > 0.05 ? 80 : 150; // More padding for closer points

        map.current.fitBounds(bounds, { 
          padding: { top: padding, bottom: padding, left: padding, right: padding },
          maxZoom: 14, // Don't zoom in too close
          duration: 1000
        });
      });
    }
  }, [pickup, drop, userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Location status indicator */}
      {locationError && (
        <div className="absolute top-4 left-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
          <p className="font-medium">⚠️ Location access denied</p>
          <p className="text-xs mt-1">Using default location (Chennai)</p>
        </div>
      )}
      
      {!userLocation && !locationError && (
        <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Getting your location...</span>
          </div>
        </div>
      )}

      {/* Pulse animation for user marker */}
      <style>{`
        @keyframes pulse-location {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
}