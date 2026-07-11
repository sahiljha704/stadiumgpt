import React, { useState, useEffect } from "react";
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, TrendingDown, TrendingUp, Users, MapPin, BarChart3, Scan } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell, CartesianGrid } from "recharts";
import { Incident, QueueData } from "../types";

const mockDensityData = [
  { time: "17:00", count: 12000 },
  { time: "17:30", count: 25000 },
  { time: "18:00", count: 45000 },
  { time: "18:30", count: 68000 },
  { time: "19:00", count: 72000 },
  { time: "19:30", count: 75000 },
];

const mockDemandData = [
  { service: "Gate A", demand: 85 },
  { service: "Gate B", demand: 40 },
  { service: "Gate C", demand: 92 },
  { service: "Food S", demand: 78 },
  { service: "Food N", demand: 30 },
  { service: "Merch", demand: 45 },
];

const mockIncidents: Incident[] = [
  { id: "INC-01", type: "medical", location: "Block 104, Row G", status: "active", description: "Fan feeling dizzy", time: "18:42" },
  { id: "INC-02", type: "security", location: "Gate A North", status: "active", description: "Unattended bag reported", time: "18:45" },
  { id: "INC-03", type: "logistics", location: "Concession 4", status: "resolved", description: "Water restock needed", time: "18:10" },
  { id: "INC-04", type: "medical", location: "Gate C South", status: "active", description: "Minor cut reported", time: "18:50" },
  { id: "INC-05", type: "security", location: "VIP Lounge", status: "resolved", description: "Unauthorized access attempt", time: "17:30" },
];

const mockQueues: QueueData[] = [
  { name: "Gate A Entry", waitTime: 12, trend: "down" },
  { name: "Gate B Entry", waitTime: 8, trend: "down" },
  { name: "Gate C Entry", waitTime: 25, trend: "up" },
  { name: "Main Washroom N", waitTime: 5, trend: "stable" },
  { name: "Main Washroom S", waitTime: 12, trend: "up" },
  { name: "Food Court North", waitTime: 9, trend: "stable" },
  { name: "Food Court South", waitTime: 18, trend: "up" },
  { name: "Merchandise Store", waitTime: 22, trend: "up" },
];

export function OperatorView() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#EDDCD9] text-[#264143] overflow-y-auto transition-colors duration-300">
      {/* Header */}
      <header className="bg-[#EDDCD9] border-b-2 border-[#264143] px-6 py-4 flex justify-between items-center sticky top-0 z-10 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#DE5499] text-[#264143] border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C] rounded-lg flex items-center justify-center font-bold">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#264143] tracking-tight">Operator Dashboard</h1>
            <p className="text-sm font-bold text-[#264143]/80">Live Stadium Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white text-[#264143] rounded-full border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C]">
            <div className="w-2 h-2 rounded-full bg-[#DE5499] animate-pulse border border-[#264143]" />
            <span className="text-sm font-bold">System Online</span>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard isLoading={isLoading} icon={<Users className="w-5 h-5 text-[#264143]" />} label="Current Attendance" value="75,420" subtext="92% capacity" />
          <KpiCard isLoading={isLoading} icon={<AlertTriangle className="w-5 h-5 text-[#264143]" />} label="Active Incidents" value={mockIncidents.filter((i) => i.status === "active").length.toString()} subtext="Requires attention" alert />
          <KpiCard isLoading={isLoading} icon={<Clock className="w-5 h-5 text-[#264143]" />} label="Avg Wait Time" value="14 min" subtext="Across all queues" />
          <KpiCard isLoading={isLoading} icon={<Activity className="w-5 h-5 text-[#264143]" />} label="AI Resolution Rate" value="94%" subtext="Fan queries automated" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Charts & Queues */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart: Crowd Ingress */}
            <div className="bg-[#EDDCD9] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#E99F4C] border-2 border-[#264143]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-black text-lg">Crowd Ingress Velocity</h2>
                <select className="text-sm border-2 border-[#264143] font-bold rounded-lg bg-white p-1.5 outline-none focus:ring-0 shadow-[2px_2px_0px_0px_#E99F4C]">
                  <option>Last 3 hours</option>
                  <option>Today</option>
                </select>
              </div>
              <div className="h-64 w-full">
                {isLoading ? (
                  <SkeletonChart />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockDensityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#DE5499" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#DE5499" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#264143" strokeOpacity={0.2} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#264143', fontWeight: 'bold' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#264143', fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '2px solid #264143', boxShadow: '3px 4px 0px 1px #E99F4C', backgroundColor: '#FFFFFF', fontWeight: 'bold' }}
                        itemStyle={{ color: '#264143' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#DE5499" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* AI Predictive Analytics */}
            <div className="bg-[#EDDCD9] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#E99F4C] border-2 border-[#264143]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#264143]" />
                  <h2 className="font-display font-black text-lg">AI Predictive Insights</h2>
                </div>
                <span className="bg-[#E99F4C] text-[#264143] text-xs font-black px-2.5 py-1 rounded-full border-2 border-[#264143]">LIVE PREDICTIONS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C]">
                  <p className="text-xs font-bold text-[#264143]/70 mb-1">Gate B Bottleneck</p>
                  <p className="font-black text-[#264143] mb-2">Predicted in 12m</p>
                  <p className="text-xs font-medium text-[#264143]">AI recommends routing 30% of incoming traffic to Gate A.</p>
                  <button className="mt-3 w-full bg-[#E99F4C] text-[#264143] border-2 border-[#264143] font-bold text-xs py-1.5 rounded-lg shadow-[1px_1px_0px_0px_#264143] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">Apply Reroute</button>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C]">
                  <p className="text-xs font-bold text-[#264143]/70 mb-1">Merchandise Store</p>
                  <p className="font-black text-[#264143] mb-2">High Demand Expected</p>
                  <p className="text-xs font-medium text-[#264143]">Halftime peak expected to exceed capacity by 15%.</p>
                  <button className="mt-3 w-full bg-white text-[#264143] border-2 border-[#264143] font-bold text-xs py-1.5 rounded-lg shadow-[1px_1px_0px_0px_#264143] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">Notify Staff</button>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C]">
                  <p className="text-xs font-bold text-[#264143]/70 mb-1">Weather Alert</p>
                  <p className="font-black text-[#264143] mb-2">Rain approaching</p>
                  <p className="text-xs font-medium text-[#264143]">Light rain expected in 45m. Roof closure advised.</p>
                  <button className="mt-3 w-full bg-[#DE5499] text-[#264143] border-2 border-[#264143] font-bold text-xs py-1.5 rounded-lg shadow-[1px_1px_0px_0px_#264143] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">Init Closure</button>
                </div>
              </div>
            </div>

            {/* Chart: Service Demand (Bar Chart) */}
            <div className="bg-[#EDDCD9] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#E99F4C] border-2 border-[#264143]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#264143]" />
                  <h2 className="font-display font-black text-lg">Live Service Demand</h2>
                </div>
              </div>
              <div className="h-56 w-full">
                {isLoading ? (
                  <SkeletonChart />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDemandData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#264143" strokeOpacity={0.2} />
                      <XAxis dataKey="service" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#264143', fontWeight: 'bold' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#264143', fontWeight: 'bold' }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(38, 65, 67, 0.1)' }}
                        contentStyle={{ borderRadius: '8px', border: '2px solid #264143', boxShadow: '3px 4px 0px 1px #E99F4C', backgroundColor: '#FFFFFF', fontWeight: 'bold' }}
                        itemStyle={{ color: '#264143' }}
                      />
                      <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                        {mockDemandData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.demand > 80 ? '#DE5499' : entry.demand > 50 ? '#E99F4C' : '#264143'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Queue Monitor */}
            <div className="bg-[#EDDCD9] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#E99F4C] border-2 border-[#264143]">
              <h2 className="font-display font-black text-lg mb-4">Live Queue Monitor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonQueue key={i} />)
                ) : (
                  mockQueues.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C]">
                      <span className="font-bold text-sm text-[#264143]">{q.name}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-black ${q.waitTime > 20 ? 'text-[#DE5499]' : q.waitTime > 10 ? 'text-[#E99F4C]' : 'text-[#264143]'}`}>
                          {q.waitTime}m
                        </span>
                        {q.trend === 'up' && <TrendingUp className="w-4 h-4 text-[#DE5499]" />}
                        {q.trend === 'down' && <TrendingDown className="w-4 h-4 text-[#264143]" />}
                        {q.trend === 'stable' && <TrendingUp className="w-4 h-4 text-[#264143] opacity-50" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Incidents */}
          <div className="bg-[#EDDCD9] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#E99F4C] border-2 border-[#264143] h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-black text-lg">Active Incidents</h2>
              {isLoading ? (
                <div className="w-12 h-5 bg-white border-2 border-[#264143] rounded-full animate-pulse" />
              ) : (
                <span className="bg-[#DE5499] text-[#264143] text-xs font-black px-2.5 py-1 rounded-full border-2 border-[#264143] shadow-[2px_2px_0px_0px_#E99F4C]">
                  {mockIncidents.filter((i) => i.status === "active").length} NEW
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                 Array.from({ length: 3 }).map((_, i) => <SkeletonIncident key={i} />)
              ) : (
                mockIncidents.map((incident) => (
                  <div key={incident.id} className={`p-4 rounded-xl border-2 border-[#264143] transition-all ${incident.status === 'active' ? 'bg-[#E99F4C]/20 shadow-[3px_3px_0px_0px_#E99F4C]' : 'bg-white shadow-[2px_2px_0px_0px_#264143]'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {incident.type === 'medical' && <Activity className={`w-4 h-4 ${incident.status === 'active' ? 'text-[#DE5499]' : 'text-[#264143]'}`} />}
                        {incident.type === 'security' && <ShieldAlert className={`w-4 h-4 ${incident.status === 'active' ? 'text-[#DE5499]' : 'text-[#264143]'}`} />}
                        {incident.type === 'logistics' && <Clock className={`w-4 h-4 ${incident.status === 'active' ? 'text-[#DE5499]' : 'text-[#264143]'}`} />}
                        <span className={`text-xs font-black uppercase tracking-wider ${incident.status === 'active' ? 'text-[#DE5499]' : 'text-[#264143]'}`}>
                          {incident.type}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#264143]">{incident.time}</span>
                    </div>
                    <p className="font-bold text-sm text-[#264143] mb-1.5">{incident.description}</p>
                    <p className="text-xs text-[#264143] font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {incident.location}
                    </p>
                    
                    {incident.status === 'active' && (
                      <div className="mt-3.5 flex gap-2">
                        <button className="flex-1 bg-white border-2 border-[#264143] text-[#264143] text-xs font-black py-2 rounded-lg hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#E99F4C] shadow-[2px_2px_0px_0px_#E99F4C] transition-all">Dispatch</button>
                        <button className="flex-1 bg-[#DE5499] border-2 border-[#264143] text-[#264143] text-xs font-black py-2 rounded-lg hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#E99F4C] shadow-[2px_2px_0px_0px_#E99F4C] transition-all">Resolve</button>
                      </div>
                    )}
                    {incident.status === 'resolved' && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-[#264143] font-black bg-white p-2 rounded-lg border-2 border-[#264143] shadow-[2px_2px_0px_0px_#264143]">
                        <CheckCircle className="w-3.5 h-3.5" /> Resolved
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <button className="w-full mt-6 py-2.5 text-sm text-[#264143] bg-white border-2 border-[#264143] font-black hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#E99F4C] shadow-[2px_2px_0px_0px_#E99F4C] rounded-xl transition-all">
              View All Logs
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ isLoading, icon, label, value, subtext, alert }: { isLoading: boolean, icon: React.ReactNode, label: string, value: string, subtext: string, alert?: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_#264143] border-2 border-[#264143] h-[120px] flex flex-col justify-between">
         <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-[#EDDCD9] border-2 border-[#264143] rounded-xl animate-pulse"></div>
           <div className="w-24 h-4 bg-[#EDDCD9] rounded animate-pulse"></div>
         </div>
         <div className="w-20 h-8 bg-[#EDDCD9] rounded animate-pulse"></div>
         <div className="w-32 h-3 bg-[#EDDCD9] rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_#E99F4C] border-2 border-[#264143]`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl border-2 border-[#264143] ${alert ? 'bg-[#DE5499]' : 'bg-[#EDDCD9]'}`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-[#264143]">{label}</span>
      </div>
      <div className="mb-1">
        <span className="font-display font-black text-3xl text-[#264143]">{value}</span>
      </div>
      <p className="text-xs text-[#264143]/70 font-bold">{subtext}</p>
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-2 animate-pulse">
       <div className="w-full flex items-end justify-between h-full px-4 gap-4 pb-4">
          <div className="w-full bg-white border-2 border-[#264143] rounded-t-md h-1/3"></div>
          <div className="w-full bg-white border-2 border-[#264143] rounded-t-md h-2/3"></div>
          <div className="w-full bg-white border-2 border-[#264143] rounded-t-md h-full"></div>
          <div className="w-full bg-white border-2 border-[#264143] rounded-t-md h-4/5"></div>
          <div className="w-full bg-white border-2 border-[#264143] rounded-t-md h-1/2"></div>
          <div className="w-full bg-white border-2 border-[#264143] rounded-t-md h-1/4"></div>
       </div>
    </div>
  )
}

function SkeletonQueue() {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-[#264143]">
      <div className="w-24 h-4 bg-[#EDDCD9] rounded animate-pulse"></div>
      <div className="w-12 h-4 bg-[#EDDCD9] rounded animate-pulse"></div>
    </div>
  )
}

function SkeletonIncident() {
  return (
    <div className="p-4 rounded-xl border-2 border-[#264143] bg-white">
       <div className="flex justify-between mb-3">
          <div className="w-20 h-4 bg-[#EDDCD9] rounded animate-pulse"></div>
          <div className="w-10 h-3 bg-[#EDDCD9] rounded animate-pulse"></div>
       </div>
       <div className="w-full h-4 bg-[#EDDCD9] rounded animate-pulse mb-2"></div>
       <div className="w-2/3 h-3 bg-[#EDDCD9] rounded animate-pulse"></div>
    </div>
  )
}
