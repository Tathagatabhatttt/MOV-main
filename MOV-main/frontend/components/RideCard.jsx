export default function RideCard({ provider, price, eta, rating, color, reliability, showReliability }) {
  const colorClasses = {
    gray: "from-gray-800 to-gray-700",
    blue: "from-blue-600 to-blue-500",
    "blue-light": "from-blue-500 to-blue-400"
  };

  return (
    <div className="bg-gray-800 border-2 border-blue-500/20 rounded-2xl p-4 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group">
      <div className="flex items-center justify-between">
        {/* Left: Provider info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
            {provider[0]}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{provider}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"></path>
                </svg>
                {eta}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {rating}
              </span>
            </div>
            
            {/* Reliability Score */}
            {showReliability && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-1.5 max-w-[80px]">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${reliability}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-400 font-medium">{reliability}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Price & Book */}
        <div className="text-right">
          <div className="text-xl font-bold text-white mb-2">{price}</div>
          <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg group-hover:bg-blue-700 transition shadow-md shadow-blue-500/30">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}