import React, { useEffect, useState, useRef } from 'react';
import PancaranLogo from './PancaranLogo';
import { 
  Play, 
  Shield, 
  Globe, 
  Ship, 
  Truck, 
  Cpu, 
  Activity, 
  ArrowRight, 
  User,
  Upload,
  Volume2,
  VolumeX,
  Maximize2,
  Pause,
  FileVideo,
  Eye,
  Video
} from 'lucide-react';

interface LandingPageProps {
  savedUserEmail: string | null;
  onProceed: () => void;
  onQuickProceedAsUser?: () => void;
}

const PRESET_BGS = [
  { id: 'utama', name: '🎥 Video Utama', url: '/background-prama.mp4' },
  { id: 'laut', name: '🚢 Kapal Laut', url: 'https://assets.mixkit.co/videos/preview/mixkit-container-ship-sailing-in-the-sea-aerial-view-41535-large.mp4' },
  { id: 'pelabuhan', name: '🏗️ Pelabuhan', url: 'https://assets.mixkit.co/videos/preview/mixkit-cargo-ship-docked-at-a-port-terminal-aerial-view-41485-large.mp4' },
  { id: 'darat', name: '🚛 Jalan Tol', url: 'https://assets.mixkit.co/videos/preview/mixkit-truck-driving-on-a-highway-aerial-view-41534-large.mp4' },
];

export default function LandingPage({ savedUserEmail, onProceed, onQuickProceedAsUser }: LandingPageProps) {
  const [telemetryTime, setTelemetryTime] = useState<string>('');
  const [activeSignal, setActiveSignal] = useState(true);

  // States for background cinematic video selection - Defaulted to /background-prama.mp4
  const [activeBgId, setActiveBgId] = useState<string>('utama');
  const [activeBgUrl, setActiveBgUrl] = useState<string>('/background-prama.mp4');

  // States for custom video player
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null);
  const [isBgCustom, setIsBgCustom] = useState<boolean>(true);
  const [videoPlayState, setVideoPlayState] = useState<boolean>(true);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update animated telemetry info
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTime(new Date().toLocaleTimeString('id-ID'));
      setActiveSignal(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle custom corporate video file choice
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (customVideoUrl) {
        URL.revokeObjectURL(customVideoUrl);
      }
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoFile(file);
      setIsBgCustom(true); // Automatically set custom uploaded promo video as ambient background
      setVideoPlayState(true);
    }
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (customVideoUrl) {
        URL.revokeObjectURL(customVideoUrl);
      }
    };
  }, [customVideoUrl]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between overflow-hidden font-sans" id="landing-page-container">
      
      {/* 1. HTML5 Cinematic Loop Background Video - Dynamic based on selected preset background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          key={activeBgUrl}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-100 scale-100 transition-all duration-1000 animate-fade-in"
          id="landing-bg-video"
        >
          <source src={activeBgUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Soft immersive dark overlay (z-10) to make text, PRAMA card, and Pancaran Group logo pop with high contrast */}
        <div className="absolute inset-0 bg-[#0a1128]/70 z-10" />
        {/* Animated Digital Grid Overlay to resemble video's matrix effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.15)_1px,transparent_1px)] bg-[size:45px_45px] opacity-25 z-10" />
      </div>

      {/* 2. Top Hud System Nav - Set to z-30 to stay above video and dark overlay */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white/95 p-2 rounded-xl shadow-lg border border-white/20">
            <PancaranLogo className="h-8" />
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-[#00A4E4] font-display uppercase tracking-widest block">Pancaran Group</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block">INTEGRATED LOGISTICS SOLUTION</span>
          </div>
        </div>

        {/* Live status telemetry widget & background controller */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-350 font-mono text-[12px] sm:text-[10px]">
          {/* Preset Background Changer */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-white/10 rounded-xl p-1 shadow-inner">
            <span className="text-[9px] text-slate-400 font-bold px-2 block uppercase tracking-wider">GANTI GAMBAR:</span>
            {PRESET_BGS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  setActiveBgId(bg.id);
                  setActiveBgUrl(bg.url);
                }}
                className={`py-1.5 px-3 rounded-lg font-black text-[10px] sm:text-[9px] tracking-wider transition-all cursor-pointer ${
                  activeBgId === bg.id 
                    ? 'bg-[#00A4E4] text-white shadow-md shadow-[#00A4E4]/30' 
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {bg.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-white/5 rounded-lg px-3 py-1.5 backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full ${activeSignal ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-emerald-600'} transition-all`} />
            <span className="text-slate-300">PRAMA DIRECT-LINK</span>
          </div>
        </div>
      </header>

      {/* 3. Main Center Welcome Showcase Box */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full text-center">
        
        {/* Immersive Frosted Glass Showcase Container */}
        <div className="backdrop-blur-md bg-slate-950/50 p-8 sm:p-12 border border-white/10 rounded-3xl shadow-2xl shadow-slate-950/80 max-w-3xl w-full flex flex-col items-center transition-all duration-300 hover:border-[#00A4E4]/30">
          
          {/* Animated Greeting Label Badge */}
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-400/20 text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-pulse" id="greeting-badge">
            <Activity className="h-4 w-4 text-sky-400" />
            <span>Sistem Robotik Kecerdasan Buatan Terpadu</span>
          </div>

          {/* Cinematic Title Area with Dynamic Text Shadow for maximum readability */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            PRAMA <span className="text-[#00A4E4] font-extrabold relative">SYSTEM</span>
          </h1>
          <p className="font-display text-[10px] sm:text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-200 mt-2.5 drop-shadow-sm font-mono text-[#00A4E4]/90">
            Project Management Analitic &mdash; Pancaran Group Indonesia
          </p>

          {/* Core Description with logistics bullets */}
          <p className="text-slate-350 text-xs sm:text-sm md:text-base max-w-xl mt-5 leading-relaxed drop-shadow-sm">
            Platform penunjang keputusan komersial, operasional, & akurasi keuangan. Ditenagai asisten AI penasihat khusus untuk pilar divisi komersial logistik darat & laut Pancaran Group.
          </p>

          {/* Space adjustment after video removal */}
          <div className="h-2" />

          {/* Interconnected Tech Badges representing the video content */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-8">
            <div className="bg-slate-950/60 border border-white/5 p-3 rounded-2xl flex items-center gap-2 text-left">
              <div className="p-2 bg-[#00A4E4]/20 text-[#00A4E4] rounded-lg">
                <Ship className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] text-slate-400 block font-mono">ARMADA LAUT</span>
                <span className="text-[11px] font-bold font-sans text-slate-200 truncate block">Tugboat & Barge</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-white/5 p-3 rounded-2xl flex items-center gap-2 text-left">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Truck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] text-slate-400 block font-mono">ARMADA DARAT</span>
                <span className="text-[11px] font-bold font-sans text-slate-200 truncate block">Trailer Logistics</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-white/5 p-3 rounded-2xl flex items-center gap-2 text-left">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] text-slate-400 block font-mono">CAKUPAN RUTE</span>
                <span className="text-[11px] font-bold font-sans text-slate-200 truncate block">Nasional Indo</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-white/5 p-3 rounded-2xl flex items-center gap-2 text-left">
              <div className="p-2 bg-[#0B2C56]/40 text-sky-400 rounded-lg">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] text-slate-400 block font-mono">TEKNOLOGI AI</span>
                <span className="text-[11px] font-bold font-sans text-slate-200 truncate block">PRAMA Analitic</span>
              </div>
            </div>
          </div>

          {/* 4. Action Buttons (Central Landing Clickers) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-sm">
            {savedUserEmail ? (
              // If already logged in, offer bypass click representing natural enter
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={onProceed}
                  className="w-full bg-[#00A4E4] hover:bg-[#008fca] text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-[#00A4E4]/25 hover:shadow-[#00A4E4]/40 text-xs tracking-wide uppercase flex items-center justify-center gap-2 font-display"
                  id="landing-btn-enter"
                >
                  <span>Masuk Portal PRAMA</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={onQuickProceedAsUser}
                  className="w-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold py-2 px-5 rounded-xl transition-all duration-300 border border-white/10 flex items-center justify-center gap-2 text-xs backdrop-blur-sm cursor-pointer"
                  id="landing-btn-user"
                >
                  <User className="h-3.5 w-3.5 text-[#00A4E4]" />
                  <span>Lanjut Sebagai {savedUserEmail.split('@')[0].toUpperCase()}</span>
                </button>
              </div>
            ) : (
              // Standard click to login screen
              <button
                onClick={onProceed}
                className="w-full bg-[#00A4E4] hover:bg-[#008fca] text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-[#00A4E4]/30 hover:shadow-[#00A4E4]/40 text-xs tracking-wider uppercase flex items-center justify-center gap-2 font-display"
                id="landing-btn-login-gate"
              >
                <span>Masuk Ke Menu Login</span>
                <ArrowRight className="h-4 w-4 text-white animate-bounce-horizontal" />
              </button>
            )}
          </div>

        </div>
      </main>

      {/* 5. Telemetry Footing HUD */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-mono text-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span>&copy; {new Date().getFullYear()} PANCARAN GROUP INDONESIA</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span>SISTEM INFORMASI LOGISTIK TERPADU</span>
        </div>
        
        <div className="flex gap-4">
          <span className="text-emerald-400">● SAT_CONN_STABLE</span>
          <span>SECURE DESKTOP SHELL</span>
          <span className="text-[#00A4E4]">v1.0.0</span>
        </div>
      </footer>

      {/* Tiny CSS injection for slide-in animation specifically for landing arrow */}
      <style>{`
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite;
        }
      `}</style>
    </div>
  );
}
