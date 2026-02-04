import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Waitlist() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("movzz_user");
    
    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Starfield background - More stars for richness */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2.5 + 0.3}px`,
              height: `${Math.random() * 2.5 + 0.3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite ${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* EXACT Framer template horizon/planet glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[55vh] pointer-events-none">
        {/* Large elliptical glow base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[2000px] h-[150%]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-[50%] bg-gradient-radial from-cyan-500/15 via-blue-600/8 to-transparent opacity-70 blur-3xl"></div>
        </div>
        
        {/* Bright core glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]">
          <div className="w-full h-full bg-gradient-radial from-blue-400/25 via-cyan-500/10 to-transparent blur-2xl"></div>
        </div>
        
        {/* Inner bright center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]">
          <div className="w-full h-full bg-gradient-radial from-cyan-300/20 via-blue-400/10 to-transparent blur-xl"></div>
        </div>
        
        {/* Horizon line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
        
        {/* Soft atmospheric glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-blue-950/20 via-cyan-950/5 to-transparent"></div>
        
        {/* Subtle side glows */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-r from-transparent to-cyan-500/5 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-gradient-to-l from-transparent to-blue-500/5 blur-2xl"></div>
      </div>

      {/* Top badge - FIXED POSITION */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-xl">
          <span className="text-white text-sm font-semibold">MOVZZ</span>
          <span className="text-gray-500 text-xs">✦</span>
          <span className="text-gray-300 text-sm">Early Access</span>
        </div>
      </div>

      {/* Content - PROPER SPACING */}
      <div className="relative z-10 text-center px-6 max-w-4xl mt-20">
        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
          Good things come<br />
          to those <span className="italic font-serif">who wait.</span>
        </h1>

        {/* Personalized welcome */}
        <p className="text-xl md:text-2xl text-cyan-300 mb-3 font-light">
          Welcome, <span className="font-semibold text-cyan-400">{userName}</span>
        </p>

        {/* Subtext */}
        <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          You're on the list. We're building something special,<br className="hidden sm:block" />
          and you'll be among the first to experience it.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/demo")}
          className="inline-flex items-center gap-3 bg-white text-black px-9 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
        >
          View Demo
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>

        {/* Bottom tagline */}
        <p className="text-gray-600 text-xs md:text-sm mt-16 font-medium tracking-wider">
          MOVZZ — Compare. Choose. Move.
        </p>
      </div>

      {/* Bottom right badge */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:block">
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-full px-4 py-2">
          <span className="text-gray-400 text-xs font-medium">Powered by MOVZZ</span>
        </div>
      </div>

      {/* Animations and styles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
        
        /* Perfect black background */
        .bg-black {
          background: #000000;
        }
        
        /* Smooth text rendering */
        h1, p {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}