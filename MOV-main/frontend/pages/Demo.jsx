import { useState, useEffect } from "react";
import MapView from "../components/MapView";
import RideCard from "../components/RideCard";

export default function Demo() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [userId] = useState(`user_${Math.floor(Math.random() * 1000)}`);

  // Booking state
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Mock data as fallback/initial comparison
  const mockRides = [
    {
      provider: "Uber",
      price: 245,
      eta: 4,
      rating: 4.8,
      reliability: 92,
      color: "gray",
      estimateId: "uber_123"
    },
    {
      provider: "Ola",
      price: 220,
      eta: 6,
      rating: 4.6,
      reliability: 85,
      color: "blue",
      estimateId: "ola_456"
    },
    {
      provider: "Rapido",
      price: 180,
      eta: 3,
      rating: 4.7,
      reliability: 88,
      color: "blue-light",
      estimateId: "rapido_789"
    }
  ];

  // Category calculations
  const getBestRide = () => {
    return [...rides].sort((a, b) => b.reliability - a.reliability);
  };

  const getCheapestRide = () => {
    return [...rides].sort((a, b) => {
      const priceA = typeof a.price === 'string' ? parseInt(a.price.replace('₹', '')) : a.price;
      const priceB = typeof b.price === 'string' ? parseInt(b.price.replace('₹', '')) : b.price;
      return priceA - priceB;
    });
  };

  const getFastestRide = () => {
    return [...rides].sort((a, b) => {
      const etaA = typeof a.eta === 'string' ? parseInt(a.eta) : a.eta;
      const etaB = typeof b.eta === 'string' ? parseInt(b.eta) : b.eta;
      return etaA - etaB;
    });
  };

  const handleShowOptions = async () => {
    if (!pickup || !drop) {
      alert("Please enter both pickup and drop locations");
      return;
    }

    setIsLoading(true);
    setShowOptions(false);
    setBookingId(null);
    setBookingStatus(null);
    setRides(mockRides);

    try {
      const searchResponse = await fetch('http://localhost:3001/api/rides/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          pickup: { lat: 12.9716, lon: 77.5946, address: pickup },
          dropoff: { lat: 12.9800, lon: 77.6000, address: drop }
        })
      });

      const searchData = await searchResponse.json();

      if (searchData.success) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const estResponse = await fetch(`http://localhost:3001/api/rides/estimates/${searchData.searchId}?userId=${userId}`);
        const estData = await estResponse.json();

        if (estData.success && estData.estimates) {
          const nyRides = estData.estimates.map(est => ({
            provider: "Namma Yatri",
            price: est.estimatedFare,
            eta: Math.round(est.estimatedDuration / 60),
            rating: "4.9",
            reliability: 96,
            color: est.vehicleVariant.includes('AUTO') ? "blue" : "blue-light",
            estimateId: est.estimateId
          }));
          setRides([...mockRides, ...nyRides]);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
      setShowOptions(true);
    }
  };

  const handleBookRide = async (estimateId) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/rides/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimateId, userId })
      });
      const data = await response.json();
      if (data.success) {
        setBookingId(data.bookingId);
        startPolling(data.bookingId);
      }
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (bId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/rides/status/${bId}?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          setBookingStatus(data.data);
          if (['TRIP_ASSIGNED', 'CANCELLED', 'COMPLETED'].includes(data.status)) {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Polling Error:", error);
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="h-screen flex bg-black">
      {/* Left Panel */}
      <div className="w-full md:w-[480px] bg-gray-900 shadow-2xl z-20 flex flex-col border-r border-blue-500/20">
        {/* Header */}
        <div className="p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-900 to-blue-800">
          <h1 className="text-2xl font-bold text-white mb-1">Plan your move</h1>
          <p className="text-blue-200 text-sm">Compare prices across all providers</p>
        </div>

        {/* Input Section (Hidden when tracking) */}
        {!bookingId && (
          <div className="p-6 space-y-4 border-b border-blue-500/20">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-500/20"></div>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="w-full pl-10 pr-4 py-4 bg-black border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center"><div className="w-0.5 h-6 bg-blue-500/30"></div></div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Drop Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full ring-4 ring-red-500/20"></div>
                <input
                  type="text"
                  placeholder="Enter drop location"
                  className="w-full pl-10 pr-4 py-4 bg-black border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleShowOptions}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
            >
              {isLoading ? "Searching..." : "Show all options"}
            </button>
          </div>
        )}

        {/* Results / Tracking Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {bookingId ? (
            <div className="space-y-6 animate-in fade-in duration-700">
              <div className="bg-blue-600/10 border-2 border-blue-500/30 rounded-3xl p-8 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Finding your ride</h2>
                <div className="flex items-center justify-center gap-3 text-blue-400">
                  {(!bookingStatus || bookingStatus.status === 'SEARCHING') && (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span className="font-medium">
                    {bookingStatus?.status === 'TRIP_ASSIGNED' ? 'Driver Assigned!' : 'Notifying nearby drivers...'}
                  </span>
                </div>
              </div>

              {bookingStatus?.driver && (
                <div className="bg-gray-800 rounded-3xl p-6 border border-white/5 space-y-5 animate-in slide-in-from-bottom-6 duration-500 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                      👤
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{bookingStatus.driver.name}</h3>
                      <p className="text-blue-400 text-sm font-medium">⭐ {bookingStatus.driver.rating} • {bookingStatus.vehicle?.model}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">📞</button>
                      <button className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">💬</button>
                    </div>
                  </div>

                  <div className="bg-black/50 p-5 rounded-2xl text-center border border-blue-500/20">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Vehicle Match</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-widest">{bookingStatus.vehicle?.number}</p>
                  </div>

                  <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 text-gray-500 text-sm font-medium hover:text-red-400 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ) : showOptions && !isLoading ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  Top Reliability
                </h3>
                <div className="space-y-4">
                  {getBestRide().slice(0, 1).map((ride, idx) => (
                    <RideCard
                      key={idx}
                      {...ride}
                      onBook={() => handleBookRide(ride.estimateId)}
                      price={typeof ride.price === 'string' ? ride.price : `₹${ride.price}`}
                      eta={typeof ride.eta === 'string' ? ride.eta : `${ride.eta} mins`}
                      showReliability={true}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 font-bold text-lg mb-4">Compare All</h3>
                <div className="space-y-4">
                  {getCheapestRide().map((ride, idx) => (
                    <RideCard
                      key={idx}
                      {...ride}
                      onBook={() => handleBookRide(ride.estimateId)}
                      price={typeof ride.price === 'string' ? ride.price : `₹${ride.price}`}
                      eta={typeof ride.eta === 'string' ? ride.eta : `${ride.eta} mins`}
                      showReliability={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-300 font-medium">Scanning live networks...</p>
                  <p className="text-xs text-gray-500">Checking Namma Yatri & other providers</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6-xl opacity-20">🗺️</div>
                  <p className="text-gray-400 font-medium pt-4">Enter locations to start comparing</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Overlay */}
      <div className="flex-1 relative">
        <MapView pickup={pickup} drop={drop} />

        <div className="absolute top-6 right-6 bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30 flex items-center gap-3 shadow-2xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="font-black italic tracking-tighter bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent text-xl">
            MOVZZ
          </span>
        </div>
      </div>
    </div>
  );
}