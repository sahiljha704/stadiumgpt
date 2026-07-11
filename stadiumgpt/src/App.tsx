/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { FanView } from "./components/FanView";
import { OperatorView } from "./components/OperatorView";
import { LandingPage } from "./components/LandingPage";
import { OperatorAuth } from "./components/OperatorAuth";
import { AuthPage } from "./components/AuthPage";
import { InteractiveStadium } from "./components/InteractiveStadium";
import UserCursor from "./components/UserCursor";
import { Shield, Smartphone, Scan, X, LayoutDashboard, Ticket, Map } from "lucide-react";
import { Toaster, toast } from "sonner";

// Function to play a short notification beep using Web Audio API
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Drop to A4
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Keep volume low
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

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

export default function App() {
  const [appState, setAppState] = useState<"landing" | "auth" | "loading" | "app">("landing");
  const [view, setView] = useState<"fan" | "operator" | "interactive_map">("interactive_map");
  const [isOperatorAuthenticated, setIsOperatorAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const startApp = () => {
    setAppState("auth");
  };

  const handleLogin = () => {
    setAppState("loading");
    setTimeout(() => {
      setAppState("app");
    }, 2000);
  };

  const viewRef = useRef(view);
  const authRef = useRef(isOperatorAuthenticated);

  useEffect(() => {
    viewRef.current = view;
    authRef.current = isOperatorAuthenticated;
  }, [view, isOperatorAuthenticated]);

  useEffect(() => {
    // Only simulate events if in the main app
    if (appState !== "app") return;

    // Simulate real-time stadium updates
    const interval = setInterval(() => {
      if (viewRef.current !== "operator" || !authRef.current) return;

      const events = [
        () => { playNotificationSound(); toast.warning("Gate C is experiencing high congestion.", { description: "Please use Gate D for faster entry." }) },
        () => { playNotificationSound(); toast.info("Match update: Argentina 1 - 0 France", { description: "Goal by Lionel Messi (23')" }) },
        () => { playNotificationSound(); toast.error("Medical incident reported", { description: "Sector 104, Row G. Medical team dispatched." }) },
        () => { playNotificationSound(); toast.success("Queue resolved", { description: "Food Court South wait time is now under 5 minutes." }) }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      randomEvent();
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [appState]);

  const navigateTo = (targetView: "fan" | "operator" | "interactive_map") => {
    setView(targetView);
    setIsSidebarOpen(false);
    if (appState === "landing") {
      setAppState("auth");
    }
    if (targetView !== "operator") {
      setIsOperatorAuthenticated(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" theme="light" richColors closeButton />
      <UserCursor name="Explore" />
      
      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="flex justify-between items-center mb-8">
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
            <span className="font-display font-black text-xl tracking-tight text-[#264143]">Menu</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="w-8 h-8 rounded-full border-2 border-[#264143] bg-white flex items-center justify-center hover:bg-[#DE5499] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <button onClick={() => navigateTo("operator")} className="flex items-center justify-between p-4 bg-white border-2 border-[#264143] rounded-xl shadow-[3px_4px_0px_1px_#E99F4C] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[5px_6px_0px_1px_#E99F4C] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E99F4C] border-2 border-[#264143] flex items-center justify-center group-hover:bg-[#DE5499] transition-colors">
                <LayoutDashboard className="w-5 h-5 text-[#264143]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-black text-[#264143] text-lg">Control Room</span>
                <span className="text-xs font-bold text-[#264143]/60">Operator Dashboard</span>
              </div>
            </div>
          </button>

          <button onClick={() => navigateTo("interactive_map")} className="flex items-center justify-between p-4 bg-white border-2 border-[#264143] rounded-xl shadow-[3px_4px_0px_1px_#E99F4C] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[5px_6px_0px_1px_#E99F4C] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E99F4C] border-2 border-[#264143] flex items-center justify-center group-hover:bg-[#DE5499] transition-colors">
                <Map className="w-5 h-5 text-[#264143]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-black text-[#264143] text-lg">Interactive Map</span>
                <span className="text-xs font-bold text-[#264143]/60">Explore Stadium</span>
              </div>
            </div>
          </button>
          
          <button onClick={() => navigateTo("fan")} className="flex items-center justify-between p-4 bg-white border-2 border-[#264143] rounded-xl shadow-[3px_4px_0px_1px_#E99F4C] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[5px_6px_0px_1px_#E99F4C] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E99F4C] border-2 border-[#264143] flex items-center justify-center group-hover:bg-[#DE5499] transition-colors">
                <Ticket className="w-5 h-5 text-[#264143]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-black text-[#264143] text-lg">Fan Experience</span>
                <span className="text-xs font-bold text-[#264143]/60">AI Assistant</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {appState === "landing" && (
        <LandingPage onStart={startApp} onOpenSidebar={() => setIsSidebarOpen(true)} />
      )}

      {appState === "auth" && (
        <AuthPage onLogin={handleLogin} />
      )}

      {appState === "loading" && (
        <div className="w-full h-[100dvh] flex flex-col items-center justify-center transition-colors duration-300 bg-[#EDDCD9] text-[#264143]">
          <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
            <div className="wheel"></div>
            <div className="hamster">
              <div className="hamster__body">
                <div className="hamster__head">
                  <div className="hamster__ear"></div>
                  <div className="hamster__eye"></div>
                  <div className="hamster__nose"></div>
                </div>
                <div className="hamster__limb hamster__limb--fr"></div>
                <div className="hamster__limb hamster__limb--fl"></div>
                <div className="hamster__limb hamster__limb--br"></div>
                <div className="hamster__limb hamster__limb--bl"></div>
                <div className="hamster__tail"></div>
              </div>
            </div>
            <div className="spoke"></div>
          </div>
          <p className="font-display font-black text-lg mt-12 animate-pulse text-[#264143]">Initializing Stadium Copilot...</p>
        </div>
      )}

      {appState === "app" && (
        <div className="h-[100dvh] w-full flex flex-col font-sans transition-colors duration-300 bg-[#EDDCD9] text-[#264143]">
          <header className="px-4 py-3 flex items-center justify-between shrink-0 z-40 bg-[#EDDCD9]">
            <button className="back-button" onClick={() => { setAppState("landing"); setIsOperatorAuthenticated(false); }}>
              <div className="back-button-box">
                <span className="back-button-elem">
                  <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                  </svg>
                </span>
                <span className="back-button-elem">
                  <svg viewBox="0 0 46 40">
                    <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                  </svg>
                </span>
              </div>
            </button>
            <button className="play-btn scale-75 origin-right" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12 7 16 10 14.5 15 9.5 15 8 10" fill="currentColor" />
                <line x1="12" y1="7" x2="12" y2="2" />
                <line x1="16" y1="10" x2="21" y2="9" />
                <line x1="14.5" y1="15" x2="17.5" y2="20" />
                <line x1="9.5" y1="15" x2="6.5" y2="20" />
                <line x1="8" y1="10" x2="3" y2="9" />
              </svg>
              <span className="now">menu</span>
              <span className="play">open</span>
            </button>
          </header>

          <main className="flex-1 overflow-hidden relative">
            {view === "fan" ? (
              <FanView />
            ) : view === "interactive_map" ? (
              <InteractiveStadium />
            ) : (
              !isOperatorAuthenticated ? (
                 <OperatorAuth onAuthenticated={() => setIsOperatorAuthenticated(true)} />
              ) : (
                 <OperatorView />
              )
            )}
          </main>
        </div>
      )}
    </>
  );
}

