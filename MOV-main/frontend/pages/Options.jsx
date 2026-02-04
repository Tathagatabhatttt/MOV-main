export default function Options() {
  return (
    <div className="mt-6 space-y-3">
      {[
        { name: "Uber", price: "₹240", eta: "5 min", score: "92%" },
        { name: "Ola", price: "₹230", eta: "6 min", score: "88%" },
        { name: "Rapido", price: "₹210", eta: "7 min", score: "85%" }
      ].map((ride) => (
        <div
          key={ride.name}
          className="border rounded-xl p-4 flex justify-between"
        >
          <div>
            <p className="font-medium">{ride.name}</p>
            <p className="text-sm text-gray-500">
              ETA {ride.eta} • Reliability {ride.score}
            </p>
          </div>
          <p className="font-semibold">{ride.price}</p>
        </div>
      ))}
    </div>
  );
}
