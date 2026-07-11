import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useCursor, Text, SpotLight, Float } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from 'sonner';

// Data for Stadium Zones
const ZONES = [
  { id: 'seating_n', name: 'North Stand', position: [0, 5, -55], scale: [110, 10, 25], color: '#ffffff', type: 'seating', capacity: 25000, current: 22000, temp: 22 },
  { id: 'seating_s', name: 'South Stand', position: [0, 5, 55], scale: [110, 10, 25], color: '#ffffff', type: 'seating', capacity: 25000, current: 24500, temp: 24 },
  { id: 'seating_e', name: 'East Stand', position: [65, 5, 0], scale: [20, 10, 85], color: '#ffffff', type: 'seating', capacity: 15000, current: 12000, temp: 21 },
  { id: 'seating_w', name: 'West Stand (VIP)', position: [-65, 5, 0], scale: [20, 10, 85], color: '#ffffff', type: 'vip', capacity: 10000, current: 9500, temp: 20 },
  { id: 'gate_a', name: 'Gate A (North)', position: [0, 0, -75], scale: [15, 6, 10], color: '#ffffff', type: 'gate', queue: '12m', status: 'CROWDED' },
  { id: 'gate_b', name: 'Gate B (South)', position: [0, 0, 75], scale: [15, 6, 10], color: '#ffffff', type: 'gate', queue: '5m', status: 'NORMAL' },
  { id: 'medical_1', name: 'Medical Center', position: [80, 0, 55], scale: [10, 5, 10], color: '#ffffff', type: 'medical', status: 'STANDBY' },
  { id: 'food_1', name: 'Food Court North', position: [80, 0, -55], scale: [12, 5, 12], color: '#ffffff', type: 'food', queue: '18m', status: 'BUSY' },
  { id: 'security', name: 'Security HQ', position: [-80, 0, 55], scale: [10, 5, 10], color: '#ffffff', type: 'security', status: 'ACTIVE' },
];

function CameraController({ viewMode, selectedZone }: { viewMode: string, selectedZone: any }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!controlsRef.current) return;
    
    if (selectedZone) {
      targetPos.set(
        selectedZone.position[0] + 40,
        selectedZone.position[1] + 30,
        selectedZone.position[2] + 40
      );
      targetLook.set(...selectedZone.position);
    } else {
      targetLook.set(0, 0, 0);
      if (viewMode === 'top') targetPos.set(0, 180, 0);
      else if (viewMode === 'iso') targetPos.set(100, 80, 100);
      else if (viewMode === 'fan') targetPos.set(0, 20, 80);
      else if (viewMode === 'operator') targetPos.set(-80, 60, -80);
    }
  }, [viewMode, selectedZone, targetPos, targetLook]);

  useFrame(() => {
    camera.position.lerp(targetPos, 0.05);
    if (controlsRef.current) {
       controlsRef.current.target.lerp(targetLook, 0.05);
       controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minDistance={20}
      maxDistance={300}
    />
  );
}

function Zone({ data, onClick, isSelected }: any) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  useCursor(hovered);

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshPhysicalMaterial;
      if (isSelected) {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      } else {
        material.emissiveIntensity = hovered ? 0.3 : 0.1;
      }
    }
  });

  const handleAnalyze = () => {
    setAnalyzing(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Analyzing ${data.name}...`,
      success: `${data.name} analysis complete. Operations normal.`,
      error: 'Analysis failed',
    });
    setTimeout(() => setAnalyzing(false), 1500);
  };

  return (
    <group position={data.position}>
      <mesh
        ref={mesh}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => setHover(false)}
      >
        <boxGeometry args={data.scale} />
        <meshPhysicalMaterial 
          color={isSelected ? '#34d399' : data.color} 
          emissive={isSelected ? '#34d399' : data.color}
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
        />
      </mesh>
      {isSelected && (
        <Html position={[0, data.scale[1]/2 + 5, 0]} center className="pointer-events-none z-10">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.2)] text-white w-72 transform transition-all duration-500 pointer-events-auto">
            <h3 className="font-display font-black text-xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight uppercase">{data.name}</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {data.capacity && (
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Density</div>
                  <div className="font-mono text-sm">{((data.current/data.capacity)*100).toFixed(1)}%</div>
                </div>
              )}
              {data.temp && (
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Temp</div>
                  <div className="font-mono text-sm">{data.temp}°C</div>
                </div>
              )}
              {data.queue && (
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Queue</div>
                  <div className="font-mono text-sm text-orange-400">{data.queue}</div>
                </div>
              )}
              <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Status</div>
                <div className="font-mono text-sm text-emerald-400">{data.status || 'ACTIVE'}</div>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-400 transition-all uppercase tracking-wider">
              {analyzing ? 'ANALYZING...' : 'Request AI Analysis'}
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

function HeatmapParticles({ visible }: { visible: boolean }) {
  const count = 4000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const basePositions = useMemo(() => new Float32Array(count * 3), [count]);
  
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      let x = 0, y = 10.5, z = 0;
      const stand = Math.floor(Math.random() * 4);
      if (stand === 0) { x = (Math.random() - 0.5) * 105; z = -55 + (Math.random() - 0.5) * 20; y = 10 + Math.random()*2; }
      else if (stand === 1) { x = (Math.random() - 0.5) * 105; z = 55 + (Math.random() - 0.5) * 20; y = 10 + Math.random()*2; }
      else if (stand === 2) { x = 65 + (Math.random() - 0.5) * 15; z = (Math.random() - 0.5) * 80; y = 10 + Math.random()*2; }
      else { x = -65 + (Math.random() - 0.5) * 15; z = (Math.random() - 0.5) * 80; y = 10 + Math.random()*2; }
      
      basePositions[i*3] = x;
      basePositions[i*3+1] = y;
      basePositions[i*3+2] = z;
      
      const distToCenter = Math.sqrt(x*x + z*z);
      const density = Math.random() * 0.4 + (1 - Math.min(distToCenter/90, 1)) * 0.6; 
      
      if (density < 0.4) {
        color.setHex(0x34d399); // green
      } else if (density < 0.7) {
        color.setHex(0xfbbf24); // yellow
      } else {
        color.setHex(0xef4444); // red
      }
      color.toArray(cols, i * 3);
    }
    return cols;
  }, [count, basePositions]);

  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        dummy.position.set(basePositions[i*3], basePositions[i*3+1], basePositions[i*3+2]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count, dummy, colors, basePositions]);

  useFrame((state) => {
    if (meshRef.current && visible) {
       const time = state.clock.elapsedTime;
       for (let i = 0; i < count; i++) {
          const x = basePositions[i*3];
          const y = basePositions[i*3+1];
          const z = basePositions[i*3+2];
          dummy.position.set(x, y + Math.sin(time * 6 + i) * 0.3, z);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
       }
       meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  );
}

export function InteractiveStadium() {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [viewMode, setViewMode] = useState('iso');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertVisible, setAlertVisible] = useState(true);

  const filteredZones = ZONES.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full h-full bg-[#05080c] relative overflow-hidden font-sans">
      {/* Top Bar UI */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight drop-shadow-lg">STADIUM<span className="text-emerald-400">TWIN</span></h1>
          <p className="text-white/60 font-mono text-xs mt-2 flex items-center gap-2 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE TELEMETRY ACTIVE
          </p>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <input 
            type="text" 
            placeholder="Search zones..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-full text-sm outline-none focus:border-emerald-500/50 transition-colors w-48 focus:w-64"
          />
        </div>
      </div>

      <Canvas camera={{ position: [100, 80, 100], fov: 45 }} className="w-full h-full">
        <color attach="background" args={['#020406']} />
        <fog attach="fog" args={['#020406', 100, 400]} />
        <ambientLight intensity={0.2} />
        
        {/* Stadium Lights */}
        <SpotLight position={[0, 150, 0]} angle={0.6} penumbra={0.5} intensity={2} color="#ffffff" castShadow />
        <SpotLight position={[100, 100, 100]} angle={0.4} penumbra={1} intensity={1} color="#ffffff" />
        <SpotLight position={[-100, 100, -100]} angle={0.4} penumbra={1} intensity={1} color="#ffffff" />
        
        {/* Pitch Field Base */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        
        {/* Stadium Outer Ring */}
        <mesh position={[0, 8, 0]}>
          <cylinderGeometry args={[95, 90, 16, 64, 1, true]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Stadium Roof */}
        <mesh position={[0, 16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[65, 95, 64]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0.1} side={THREE.DoubleSide} clearcoat={1} />
        </mesh>
        
        {/* Tech Grid */}
        <gridHelper args={[400, 40, '#ffffff', '#ffffff']} position={[0, -0.4, 0]} material-opacity={0.1} material-transparent />
        
        {/* Pitch markings */}
        <group position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[105, 68]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[9, 9.3, 32]} />
            <meshBasicMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[105, 68]} />
            <meshBasicMaterial color="#e2e8f0" wireframe />
          </mesh>
        </group>

        <HeatmapParticles visible={showHeatmap} />

        {filteredZones.map((zone) => (
          <Zone 
            key={zone.id} 
            data={zone} 
            isSelected={selectedZone?.id === zone.id}
            onClick={(z: any) => setSelectedZone(selectedZone?.id === z.id ? null : z)} 
          />
        ))}

        <CameraController viewMode={viewMode} selectedZone={selectedZone} />
      </Canvas>

      {/* View Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {['top', 'iso', 'fan', 'operator'].map((mode) => (
          <button 
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold uppercase transition-all backdrop-blur-md ${viewMode === mode ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
          >
            {mode.substring(0, 3)}
          </button>
        ))}
      </div>
      
      <div className="absolute right-6 bottom-6 flex gap-2 z-10">
         <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all backdrop-blur-md ${showHeatmap ? 'bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366]/50' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
          >
            Heatmap
          </button>
      </div>

      {/* AI Copilot Panel */}
      <div className="absolute bottom-6 left-6 w-96 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Live AI Telemetry</h3>
              <p className="text-[10px] text-emerald-400 tracking-widest uppercase">Monitoring 124 Sensors</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono">
            T-45:00
          </div>
        </div>
        
        <div className="space-y-3">
          {alertVisible && (
            <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-4 rounded-2xl border-l-2 border-orange-500">
              <p className="text-[10px] font-bold text-orange-400 mb-1 tracking-widest uppercase">Prediction Alert</p>
              <p className="text-sm text-white/90 leading-relaxed">Gate A congestion likely to peak in 10 mins. Recommend opening overflow lane A2.</p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => {
                    toast.success('Overflow lane A2 opened. Congestion easing.');
                    setAlertVisible(false);
                  }}
                  className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-xs font-bold text-orange-400 transition-colors">
                  Apply
                </button>
                <button 
                  onClick={() => setAlertVisible(false)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white/70 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
             <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-500"></div>
             <div>
                <p className="text-sm text-white/80">Weather is clear. Pitch temperature optimal. All medical zones fully operational.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
