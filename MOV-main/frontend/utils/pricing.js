export function calculatePrices(distanceKm, durationMin) {
  return {
    uber: {
      price: Math.round(40 + distanceKm * 18 + durationMin * 1.2),
      reliability: 92
    },
    ola: {
      price: Math.round(35 + distanceKm * 16 + durationMin * 1.1),
      reliability: 88
    },
    rapido: {
      price: Math.round(30 + distanceKm * 14 + durationMin * 1.0),
      reliability: 81
    }
  };
}
