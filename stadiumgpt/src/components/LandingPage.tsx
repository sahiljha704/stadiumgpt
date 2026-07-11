import { useState } from "react";
import { Bot, Map, Zap, ShieldCheck, Scan, X, LogIn, ChevronRight, LayoutDashboard, Ticket } from "lucide-react";
import TextMorph from "./TextMorph";

interface LandingPageProps {
  onStart: () => void;
  onOpenSidebar: () => void;
}

const FootballIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 7 16 10 14.5 15 9.5 15 8 10" fill="currentColor" />
    <line x1="12" y1="7" x2="12" y2="2" />
    <line x1="16" y1="10" x2="21" y2="9" />
    <line x1="14.5" y1="15" x2="17.5" y2="20" />
    <line x1="9.5" y1="15" x2="6.5" y2="20" />
    <line x1="8" y1="10" x2="3" y2="9" />
  </svg>
);

export function LandingPage({ onStart, onOpenSidebar }: LandingPageProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("1");

  const specialties: Record<string, string> = {
    "1": "AI Context Awareness: StadiumGPT understands your exact location, the current match time, and live queue wait times to give you hyper-relevant answers.",
    "2": "Real-time Telemetry: We process thousands of data points per second from turnstiles, cameras, and POS systems to power our Live Density Heatmaps.",
    "3": "Predictive Crowd Control: For operators, our ML models predict bottlenecks up to 15 minutes before they occur, automatically generating re-routing plans."
  };

  return (
    <div className="min-h-screen bg-[#EDDCD9] flex flex-col font-sans text-[#264143] overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b-2 border-[#264143] bg-[#EDDCD9] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#DE5499] text-[#264143] border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C] rounded-lg flex items-center justify-center font-bold text-lg overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 14.5a3 3 0 0 1 0-5" />
              <path d="M20 14.5a3 3 0 0 0 0-5" />
              <path d="M2 22h20" />
              <path d="M5 22V9a7 7 0 0 1 14 0v13" />
              <path d="M9 22V9" />
              <path d="M15 22V9" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-[#264143]">StadiumGPT</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="play-btn" onClick={onOpenSidebar}>
            <FootballIcon />
            <span className="now">menu</span>
            <span className="play">open</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 flex flex-col items-center justify-center text-center max-w-3xl mx-auto flex-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#264143] border-2 border-[#264143] shadow-[3px_4px_0px_1px_#E99F4C] mb-6 text-sm font-bold">
          <Zap className="w-4 h-4" />
          <span>The next generation of event intelligence</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-6 leading-tight text-[#264143]">
          Your personal AI guide for <br className="hidden md:block" />
          <span className="text-[#DE5499]">
            every live event.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#264143] font-medium mb-10 max-w-2xl">
          Navigate massive stadiums, find the shortest lines, and get real-time answers to any question. Whether you're a fan in the stands or an operator in the control room, StadiumGPT has you covered.
        </p>
        
        <div className="btn-container" onClick={onStart}>
          <button className="btn">
            <span className="btn-text">Explore Now</span>
            <div className="btn-drawer transition-top">Enjoy Match</div>
            <div className="btn-drawer transition-bottom">Explore Now</div>
            <svg
              className="btn-corner"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 100 L 10 32 A 22 22 0 0 1 32 10 L 100 10"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <svg
              className="btn-corner"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 100 L 10 32 A 22 22 0 0 1 32 10 L 100 10"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <svg
              className="btn-corner"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 100 L 10 32 A 22 22 0 0 1 32 10 L 100 10"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <svg
              className="btn-corner"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 100 L 10 32 A 22 22 0 0 1 32 10 L 100 10"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
        
        <div className="mt-20 h-40 w-full relative">
          <TextMorph 
            words="Navigate,Better" 
            color="#DE5499" 
            font={{ fontFamily: "Inter", fontSize: 120, variant: "Black", fontWeight: 900 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </div>
      </section>

      {/* Specialties Selector Section */}
      <section className="bg-[#264143] py-20 px-6 text-white border-y-2 border-[#264143] relative">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-display font-black mb-4 text-[#EDDCD9]">Discover our specialties</h2>
            <p className="text-[#EDDCD9]/80 mb-8 max-w-lg leading-relaxed font-medium">
              {specialties[selectedSpecialty]}
            </p>
          </div>
          <div className="shrink-0 flex justify-center w-full md:w-auto relative">
             <div className="radio-input relative z-10 scale-90 md:scale-100 border-2 border-[#264143] shadow-[4px_4px_0px_0px_#EDDCD9] rounded-[24px]">
               <div className="glass bg-[#DE5499]">
                 <div className="glass-inner bg-[#DE5499]"></div>
               </div>
               <div className="selector">
                 {["1", "2", "3"].map((num) => (
                   <div className="choice" key={num}>
                     <div>
                       <input
                         className="choice-circle"
                         type="radio"
                         name="radio"
                         value={num}
                         checked={selectedSpecialty === num}
                         onChange={() => setSelectedSpecialty(num)}
                       />
                       <div className="ball bg-[#264143]"></div>
                     </div>
                     <span className="choice-name text-[#264143] font-bold">{num}</span>
                   </div>
                 ))}
               </div>
             </div>
             {/* Decorative Background Glow removed for solid design */}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#EDDCD9] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-black mb-4 text-[#264143]">Everything you need for match day</h2>
            <p className="text-[#264143] font-medium max-w-xl mx-auto">Powered by advanced AI models and real-time sensor data.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Bot className="w-6 h-6 text-[#264143]" />}
              title="AI Assistant"
              description="Ask natural questions like 'Where is the nearest bathroom?' or 'What's the score?' and get instant, context-aware answers."
            />
            <FeatureCard 
              icon={<Map className="w-6 h-6 text-[#264143]" />}
              title="Interactive Map"
              description="Explore the stadium in 2D with live crowd density heatmaps. Find optimal routes to your seat or the food court."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-[#264143]" />}
              title="Control Room"
              description="For operators: Monitor crowd flow, manage active incidents, and predict congestion bottlenecks before they happen."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#264143] text-[#EDDCD9] py-8 text-center text-sm px-6 border-t-2 border-[#264143]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#DE5499] text-[#264143] rounded flex items-center justify-center font-bold text-xs border-2 border-[#264143]">
            <Scan className="w-3 h-3" />
          </div>
          <span className="font-display font-semibold text-[#EDDCD9]">StadiumGPT</span>
        </div>
        <p className="font-medium text-[#EDDCD9]/80">© 2026 Stadium Intelligence Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#DE5499] border-2 border-[#264143] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_#E99F4C] shadow-[4px_4px_0px_0px_#E99F4C] transition-all">
      <div className="w-12 h-12 bg-white border-2 border-[#264143] rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-2 text-[#264143]">{title}</h3>
      <p className="text-[#264143] leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}
