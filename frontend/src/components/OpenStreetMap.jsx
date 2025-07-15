import { useEffect, useRef, useState } from "react";
import { MapPin, X, ChevronDown } from "lucide-react";

const OpenStreetMap = ({
  height = "400px",
  defaultZoom = 2,
  selectedCoordinates,
  onCoordinatesChange,
  interactive = false,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // New state for location selection
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,latlng');
        const data = await response.json();

        // Sort countries alphabetically and filter out those without coordinates
        const sortedCountries = data
          .filter(country => country.latlng && country.latlng.length >= 2)
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
            lat: country.latlng[0],
            lng: country.latlng[1]
          }));

        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states/provinces when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState("");
      return;
    }

    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const country = countries.find(c => c.code === selectedCountry);
        if (!country) return;

        // Use Nominatim to search for administrative divisions (states/provinces)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `country=${encodeURIComponent(country.name)}&` +
          `featuretype=state&` +
          `format=json&` +
          `limit=20&` +
          `addressdetails=1`
        );

        let data = await response.json();

        // If no states found, try searching for major cities instead
        if (data.length === 0) {
          const cityResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `country=${encodeURIComponent(country.name)}&` +
            `featuretype=city&` +
            `format=json&` +
            `limit=15&` +
            `addressdetails=1`
          );
          data = await cityResponse.json();
        }

        // Process and deduplicate results
        const processedStates = data
          .filter(item => item.lat && item.lon && item.display_name)
          .map(item => ({
            name: item.display_name.split(',')[0].trim(),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            fullName: item.display_name
          }))
          .filter((state, index, array) => 
            // Remove duplicates based on name
            array.findIndex(s => s.name === state.name) === index
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20); // Limit to 20 results

        setStates(processedStates);
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry, countries]);

  // Handle country selection
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedState("");

    if (countryCode && mapInstanceRef.current) {
      const country = countries.find(c => c.code === countryCode);
      if (country) {
        // Move map to country and place marker
        mapInstanceRef.current.setView([country.lat, country.lng], 6);
        placeMarker(country.lat, country.lng, mapInstanceRef.current, false);
      }
    }
  };

  // Handle state selection
  const handleStateChange = (stateIndex) => {
    setSelectedState(stateIndex);

    if (stateIndex !== "" && mapInstanceRef.current) {
      const state = states[parseInt(stateIndex)];
      if (state) {
        // Move map to state/city and place marker
        mapInstanceRef.current.setView([state.lat, state.lng], 10);
        placeMarker(state.lat, state.lng, mapInstanceRef.current, false);
      }
    }
  };

  // Separate effect for map initialization (runs only once)
  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Use coordinates if provided, otherwise default to world view
      const lat = selectedCoordinates ? selectedCoordinates.latitude : 20;
      const lng = selectedCoordinates ? selectedCoordinates.longitude : 0;
      const zoom = selectedCoordinates ? 12 : defaultZoom;

      // Initialize the map with appropriate interactions based on mode
      const map = window.L.map(mapRef.current, {
        dragging: true,
        touchZoom: true,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        keyboard: interactive,
        zoomControl: true,
        tap: false,
        tapTolerance: 15,
      }).setView([lat, lng], zoom);

      // Disable specific zoom handlers that might cause issues
      map.touchZoom.disable();
      map.touchZoom.enable();

      // Set touch zoom to only work with multi-touch (pinch)
      if (map.touchZoom._enabled) {
        map.touchZoom._onTouchStart = (function (original) {
          return function (e) {
            if (e.touches && e.touches.length >= 2) {
              return original.call(this, e);
            }
          };
        })(map.touchZoom._onTouchStart);
      }

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add click/touch event listeners for interactive mode
      if (interactive && onCoordinatesChange) {
        // For desktop - double click
        map.on("dblclick", (e) => {
          const { lat, lng } = e.latlng;
          placeMarker(lat, lng, map);
        });

        // For mobile - long press (hold)
        let pressTimer = null;
        let startPos = null;
        let hasMoved = false;

        map.on("mousedown touchstart", (e) => {
          const originalEvent = e.originalEvent;
          startPos = { x: e.containerPoint.x, y: e.containerPoint.y };
          hasMoved = false;

          // Handle touch events (only single touch)
          if (originalEvent.touches && originalEvent.touches.length === 1) {
            pressTimer = setTimeout(() => {
              if (!hasMoved) {
                const { lat, lng } = e.latlng;
                placeMarker(lat, lng, map);
              }
            }, 700);
          }
          // Handle mouse events (excluding right clicks)
          else if (!originalEvent.touches && originalEvent.button === 0) {
            pressTimer = setTimeout(() => {
              if (!hasMoved) {
                const { lat, lng } = e.latlng;
                placeMarker(lat, lng, map);
              }
            }, 700);
          }
        });

        map.on("mousemove touchmove", (e) => {
          if (startPos) {
            const currentPos = { x: e.containerPoint.x, y: e.containerPoint.y };
            const distance = Math.sqrt(
              Math.pow(currentPos.x - startPos.x, 2) + 
              Math.pow(currentPos.y - startPos.y, 2)
            );

            if (distance > 10) {
              hasMoved = true;
              if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
              }
            }
          }
        });

        map.on("mouseup touchend", () => {
          if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
          startPos = null;
          hasMoved = false;
        });

        // Prevent context menu on long press
        map.on("contextmenu", (e) => {
          e.originalEvent.preventDefault();
          return false;
        });
      }

      mapInstanceRef.current = map;
    };

    const placeMarker = (lat, lng, map, updateCoordinates = true) => {
      // Custom pin icon for shipment location
      const shipmentIcon = window.L.divIcon({
        html: `<div style="position: relative;">
                 <div style="
                   width: 0; 
                   height: 0; 
                   border-left: 12px solid transparent; 
                   border-right: 12px solid transparent; 
                   border-top: 20px solid #10b981;
                   position: relative;
                   filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                 "></div>
                 <div style="
                   width: 16px; 
                   height: 16px; 
                   background-color: #10b981; 
                   border-radius: 50%; 
                   border: 2px solid white;
                   position: absolute;
                   top: -18px;
                   left: -8px;
                   box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                 "></div>
               </div>`,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        className: "shipment-location-icon",
      });

      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Add new marker with drag functionality
      markerRef.current = window.L.marker([lat, lng], {
        icon: shipmentIcon,
        draggable: interactive,
      }).addTo(map).bindPopup(`<strong>Selected Location</strong><br/>
                   Latitude: ${lat.toFixed(6)}<br/>
                   Longitude: ${lng.toFixed(6)}`);

      // Add drag event listeners for interactive mode
      if (interactive && onCoordinatesChange) {
        // Disable map dragging when starting to drag the marker
        markerRef.current.on("dragstart", (e) => {
          map.dragging.disable();
        });

        // Re-enable map dragging when marker drag ends
        markerRef.current.on("dragend", (e) => {
          map.dragging.enable();
          const { lat: newLat, lng: newLng } = e.target.getLatLng();
          onCoordinatesChange({
            latitude: newLat,
            longitude: newLng,
          });
          // Update popup content
          e.target.setPopupContent(`<strong>Selected Location</strong><br/>
                                  Latitude: ${newLat.toFixed(6)}<br/>
                                  Longitude: ${newLng.toFixed(6)}`);
        });

        // Optional: Handle drag event for real-time updates
        markerRef.current.on("drag", (e) => {
          // You can uncomment this if you want real-time coordinate updates while dragging
          // const { lat: newLat, lng: newLng } = e.target.getLatLng();
          // onCoordinatesChange({
          //   latitude: newLat,
          //   longitude: newLng,
          // });
        });
      }

      // Update coordinates
      if (updateCoordinates && onCoordinatesChange) {
        onCoordinatesChange({
          latitude: lat,
          longitude: lng,
        });
      }
    };

    loadLeaflet();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, [defaultZoom, interactive]);

  // Separate effect to handle coordinate changes without reinitializing the map
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCoordinates) return;

    // Custom pin icon for shipment location
    const shipmentIcon = window.L.divIcon({
      html: `<div style="position: relative;">
               <div style="
                 width: 0; 
                 height: 0; 
                 border-left: 12px solid transparent; 
                 border-right: 12px solid transparent; 
                 border-top: 20px solid #10b981;
                 position: relative;
                 filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
               "></div>
               <div style="
                 width: 16px; 
                 height: 16px; 
                 background-color: #10b981; 
                 border-radius: 50%; 
                 border: 2px solid white;
                 position: absolute;
                 top: -18px;
                 left: -8px;
                 box-shadow: 0 2px 4px rgba(0,0,0,0.2);
               "></div>
             </div>`,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      className: "shipment-location-icon",
    });

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Add marker at new coordinates without changing zoom
    markerRef.current = window.L.marker(
      [selectedCoordinates.latitude, selectedCoordinates.longitude],
      {
        icon: shipmentIcon,
        draggable: interactive,
      },
    ).addTo(mapInstanceRef.current).bindPopup(`<strong>Shipment Location</strong><br/>
                 Latitude: ${selectedCoordinates.latitude.toFixed(6)}<br/>
                 Longitude: ${selectedCoordinates.longitude.toFixed(6)}`);

    // Add drag event listeners for interactive mode
    if (interactive && onCoordinatesChange) {
      // Disable map dragging when starting to drag the marker
      markerRef.current.on("dragstart", (e) => {
        mapInstanceRef.current.dragging.disable();
      });

      // Re-enable map dragging when marker drag ends
      markerRef.current.on("dragend", (e) => {
        mapInstanceRef.current.dragging.enable();
        const { lat, lng } = e.target.getLatLng();
        onCoordinatesChange({
          latitude: lat,
          longitude: lng,
        });
        // Update popup content
        e.target.setPopupContent(`<strong>Shipment Location</strong><br/>
                                Latitude: ${lat.toFixed(6)}<br/>
                                Longitude: ${lng.toFixed(6)}`);
      });

      // Optional: Handle drag event for real-time updates
      markerRef.current.on("drag", (e) => {
        // You can uncomment this if you want real-time coordinate updates while dragging
        // const { lat, lng } = e.target.getLatLng();
        // onCoordinatesChange({
        //   latitude: lat,
        //   longitude: lng,
        // });
      });
    }
  }, [selectedCoordinates, interactive, onCoordinatesChange]);

  return (
    <div className="space-y-4">
      {/* Location Selection Dropdowns */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Select Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Country
            </label>
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                disabled={loadingCountries}
                className="w-full appearance-none bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">
                  {loadingCountries ? "Loading countries..." : "Select a country"}
                </option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* State/Province Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              State/Province/City
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={!selectedCountry || loadingStates || states.length === 0}
                className="w-full appearance-none bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">
                  {!selectedCountry ? "Select a country first" :
                   loadingStates ? "Loading locations..." :
                   states.length === 0 ? "No locations found" :
                   "Select a location"}
                </option>
                {states.map((state, index) => (
                  <option key={index} value={index}>
                    {state.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Clear Selection Button */}
        {(selectedCountry || selectedState) && (
          <div className="mt-3">
            <button
              onClick={() => {
                setSelectedCountry("");
                setSelectedState("");
                if (mapInstanceRef.current && markerRef.current) {
                  mapInstanceRef.current.removeLayer(markerRef.current);
                  markerRef.current = null;
                  mapInstanceRef.current.setView([20, 0], defaultZoom);
                }
              }}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Interactive Mode Instructions */}
      {interactive && (
        <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
          <strong>Interactive Mode:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Use the dropdowns above to quickly navigate to a location</li>
            <li>• Desktop: Double-click to place pin</li>
            <li>• Mobile: Press and hold to place pin</li>
            <li>• Click and drag the pin to move it</li>
            <li>• Use mouse wheel or pinch to zoom in/out</li>
          </ul>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height: height }}
        className="w-full rounded-lg border border-gray-600 bg-gray-700"
      >
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Loading map...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenStreetMap;