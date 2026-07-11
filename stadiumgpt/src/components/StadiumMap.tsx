import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { Clock, Navigation2, Users, X, Map as MapIcon, Activity } from "lucide-react";
import * as d3 from "d3";

interface StadiumMapProps {
  highlight: string | null;
}

type POIInfo = {
  id: string;
  name: string;
  type: string;
  waitTime: number;
  crowdLevel: "Low" | "Medium" | "High";
  distance: string;
};

const POI_DATA: Record<string, POIInfo> = {
  gate_a: { id: "gate_a", name: "Gate A", type: "Entry/Exit", waitTime: 12, crowdLevel: "Medium", distance: "120m" },
  gate_c: { id: "gate_c", name: "Gate C", type: "Entry/Exit", waitTime: 25, crowdLevel: "High", distance: "45m" },
  food_south: { id: "food_south", name: "Food Court South", type: "Concession", waitTime: 18, crowdLevel: "High", distance: "80m" },
  washroom_n: { id: "washroom_n", name: "Washroom (North)", type: "Restroom", waitTime: 5, crowdLevel: "Low", distance: "200m" },
};

export function StadiumMap({ highlight }: StadiumMapProps) {
  const [selectedPOI, setSelectedPOI] = useState<POIInfo | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  const isHighlighted = (id: string) => highlight === id || selectedPOI?.id === id;

  const handlePOIClick = (id: string) => {
    setSelectedPOI(POI_DATA[id] || null);
  };

  // Generate heatmap contours using D3
  const contours = useMemo(() => {
    if (!showHeatmap) return [];
    
    // Simulate live crowd data points (biased towards high crowd areas)
    const data: {x: number, y: number}[] = [];
    // Gate C (High)
    for (let i=0; i<250; i++) data.push({x: 660 + (Math.random() - 0.5) * 100, y: 70 + (Math.random() - 0.5) * 80});
    // Gate A (Medium)
    for (let i=0; i<100; i++) data.push({x: 140 + (Math.random() - 0.5) * 100, y: 70 + (Math.random() - 0.5) * 80});
    // Food South (High)
    for (let i=0; i<200; i++) data.push({x: 410 + (Math.random() - 0.5) * 120, y: 445 + (Math.random() - 0.5) * 80});
    // Washroom North (Low)
    for (let i=0; i<40; i++) data.push({x: 190 + (Math.random() - 0.5) * 80, y: 445 + (Math.random() - 0.5) * 60});
    // Random scatter
    for (let i=0; i<150; i++) data.push({x: Math.random() * 800, y: Math.random() * 500});

    const contourData = d3.contourDensity<{x: number, y: number}>()
      .x(d => d.x)
      .y(d => d.y)
      .size([800, 500])
      .bandwidth(30)
      .thresholds(10)
      (data);

    return contourData;
  }, [showHeatmap]);

  const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([0, d3.max(contours, d => d.value) || 0]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
      <div className="p-4 shrink-0 bg-white border-b border-gray-100 flex justify-between items-center z-10">
         <div>
           <h3 className="text-sm font-semibold text-gray-800">Interactive Stadium Map</h3>
           <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-1 inline-block">Level 1</span>
         </div>
         
         <button
           onClick={() => setShowHeatmap(!showHeatmap)}
           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
             showHeatmap 
               ? "bg-red-50 text-red-700 border-red-200 shadow-inner" 
               : "bg-white text-gray-600 border-gray-200 shadow-sm hover:bg-gray-50"
           }`}
         >
           <Activity className="w-3.5 h-3.5" />
           {showHeatmap ? "Heatmap On" : "Heatmap Off"}
         </button>
      </div>
      <div className="relative flex-1 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 500" className="w-full h-full max-h-full max-w-full">
          {/* Pitch */}
          <rect x="250" y="150" width="300" height="200" rx="10" fill="#4ade80" stroke="#22c55e" strokeWidth="4" />
          <line x1="400" y1="150" x2="400" y2="350" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
          <circle cx="400" cy="250" r="30" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
          <circle cx="400" cy="250" r="3" fill="currentColor" strokeOpacity="0.5" />
          
          {/* Seating Area */}
          <path d="M 150 50 Q 400 -50 650 50 L 700 100 Q 400 0 100 100 Z" fill="currentColor" className="text-slate-200" />
          <path d="M 150 450 Q 400 550 650 450 L 700 400 Q 400 500 100 400 Z" fill="currentColor" className="text-slate-200" />
          
          <path d="M 50 150 Q -50 250 50 350 L 100 300 Q 0 250 100 200 Z" fill="currentColor" className="text-slate-200" />
          <path d="M 750 150 Q 850 250 750 350 L 700 300 Q 800 250 700 200 Z" fill="currentColor" className="text-slate-200" />

          {/* D3 Heatmap Overlay */}
          {showHeatmap && (
            <g className="pointer-events-none mix-blend-multiply opacity-60">
              {contours.map((contour, i) => (
                <path
                  key={i}
                  d={d3.geoPath()(contour) || undefined}
                  fill={colorScale(contour.value)}
                  stroke="none"
                />
              ))}
            </g>
          )}

          {/* Highlightable POIs */}
          <g transform="translate(100, 50)" onClick={() => handlePOIClick("gate_a")} className="cursor-pointer">
            <motion.rect 
              x="0" y="0" width="80" height="40" rx="4"
              fill={isHighlighted("gate_a") ? "#3b82f6" : "#cbd5e1"} 
              animate={{ opacity: isHighlighted("gate_a") ? [0.6, 1, 0.6] : 1 }}
              transition={{ repeat: isHighlighted("gate_a") ? Infinity : 0, duration: 1.5 }}
            />
            <text x="40" y="25" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" className="pointer-events-none">Gate A</text>
          </g>

          <g transform="translate(620, 50)" onClick={() => handlePOIClick("gate_c")} className="cursor-pointer">
            <motion.rect 
              x="0" y="0" width="80" height="40" rx="4"
              fill={isHighlighted("gate_c") ? "#3b82f6" : "#cbd5e1"} 
              animate={{ opacity: isHighlighted("gate_c") ? [0.6, 1, 0.6] : 1 }}
              transition={{ repeat: isHighlighted("gate_c") ? Infinity : 0, duration: 1.5 }}
            />
            <text x="40" y="25" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" className="pointer-events-none">Gate C</text>
          </g>

          <g transform="translate(360, 420)" onClick={() => handlePOIClick("food_south")} className="cursor-pointer">
            <motion.rect 
              x="0" y="0" width="100" height="50" rx="4"
              fill={isHighlighted("food_south") ? "#f59e0b" : "#cbd5e1"} 
              animate={{ opacity: isHighlighted("food_south") ? [0.6, 1, 0.6] : 1 }}
              transition={{ repeat: isHighlighted("food_south") ? Infinity : 0, duration: 1.5 }}
            />
            <text x="50" y="30" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" className="pointer-events-none">Food Court</text>
          </g>

          <g transform="translate(150, 420)" onClick={() => handlePOIClick("washroom_n")} className="cursor-pointer">
            <motion.rect 
              x="0" y="0" width="80" height="50" rx="4"
              fill={isHighlighted("washroom_n") ? "#8b5cf6" : "#cbd5e1"} 
              animate={{ opacity: isHighlighted("washroom_n") ? [0.6, 1, 0.6] : 1 }}
              transition={{ repeat: isHighlighted("washroom_n") ? Infinity : 0, duration: 1.5 }}
            />
            <text x="40" y="30" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" className="pointer-events-none">WC (N)</text>
          </g>
          
          {/* Specific Seat */}
          <g transform="translate(420, 100)">
             <motion.circle 
                cx="0" cy="0" r="10" 
                fill={isHighlighted("seat_104") ? "#ef4444" : "transparent"} 
                animate={{ scale: isHighlighted("seat_104") ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isHighlighted("seat_104") ? Infinity : 0, duration: 1 }}
             />
             {isHighlighted("seat_104") && <text x="0" y="20" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold" className="pointer-events-none">You</text>}
          </g>

        </svg>

        {/* Suggestion based on Heatmap */}
        <AnimatePresence>
          {showHeatmap && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-blue-200 shadow-md max-w-[200px]"
            >
               <div className="flex items-center gap-2 mb-1">
                 <Users className="w-4 h-4 text-blue-600" />
                 <span className="text-xs font-bold text-gray-800">Smart Suggestion</span>
               </div>
               <p className="text-xs text-gray-600 leading-tight">
                 Gate C is currently experiencing high crowd density. Consider using <button onClick={() => handlePOIClick("gate_a")} className="text-blue-600 font-semibold hover:underline">Gate A</button> for faster entry.
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        {highlight && !selectedPOI && !showHeatmap && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-lg text-xs font-medium border border-gray-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 block animate-pulse"></span>
            Location Highlighted
          </div>
        )}

        {/* Detail Overlay */}
        <AnimatePresence>
          {selectedPOI && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-3 z-20"
             >
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="font-display font-semibold text-gray-900 text-lg">{selectedPOI.name}</h4>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{selectedPOI.type}</span>
                   </div>
                   <button 
                     onClick={() => setSelectedPOI(null)}
                     className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                   <div className="bg-gray-50 p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 border border-gray-100">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-500 font-medium">Wait Time</span>
                      <span className={`font-bold text-sm ${selectedPOI.waitTime > 20 ? 'text-red-600' : selectedPOI.waitTime > 10 ? 'text-orange-600' : 'text-green-600'}`}>
                        {selectedPOI.waitTime} min
                      </span>
                   </div>
                   <div className="bg-gray-50 p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 border border-gray-100">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500 font-medium">Crowd</span>
                      <span className="font-bold text-sm text-gray-900">{selectedPOI.crowdLevel}</span>
                   </div>
                   <div className="bg-gray-50 p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 border border-gray-100">
                      <Navigation2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500 font-medium">Distance</span>
                      <span className="font-bold text-sm text-gray-900">{selectedPOI.distance}</span>
                   </div>
                </div>

                <button className="w-full mt-1 bg-blue-600 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                   <Navigation2 className="w-4 h-4" />
                   Navigate Here
                </button>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
