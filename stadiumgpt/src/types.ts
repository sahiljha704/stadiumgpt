export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Incident {
  id: string;
  type: "medical" | "security" | "logistics";
  location: string;
  status: "active" | "resolved";
  description: string;
  time: string;
}

export interface QueueData {
  name: string;
  waitTime: number;
  trend: "up" | "down" | "stable";
}
