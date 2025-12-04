// Site/Location types
export type SystemType = 'cargoclix' | 'lfs_v8';
export type DataSourceType = 'cargoclix' | 'lfs_v8' | 'manual' | 'excel_import';
export type OperatingMode = 'integrated' | 'standalone';

export interface Site {
    id: string;
    name: string;
    dockCount: number;
    hasTimeSlotSystem: boolean;
    systems: SystemType[];
    city: string;
}

// Dock types
export type DockStatus = 'free' | 'occupied' | 'reserved' | 'maintenance';
export type DockType = 'standard' | 'heavy' | 'cooling';

export interface Dock {
    id: number;
    name: string;
    type: DockType;
    status: DockStatus;
    currentTruck: string | null;
    queue: number;
    avgTime: number | null;
    historicalPerf: string | null;
}

// Truck types
export type TruckStatus = 'approaching' | 'assigned' | 'docking' | 'processing' | 'completed';

export interface Truck {
    id: string;
    carrier: string;
    eta: string;
    scheduledSlot: string;
    cargo: string;
    weight: string;
    status: TruckStatus;
    delay: number; // minutes, negative = early
    dockId: number | null;
}

// AI Recommendation types
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationType = 'dock' | 'alert' | 'optimization';

export interface RecommendationImpact {
    waitTime: [number, number]; // minutes saved range [min, max]
    savings: [number, number]; // EUR range [min, max]
    co2: [number, number]; // kg CO2 reduction range [min, max]
}

export interface Recommendation {
    id: number;
    type: RecommendationType;
    priority: RecommendationPriority;
    title: string;
    description: string;
    historicalNote: string;
    confidence: number; // 0-100
    impact: RecommendationImpact;
    truckId: string | null;
    dockId: number | null;
}

// AI Agent types
export type AgentStatus = 'active' | 'processing' | 'idle';

export interface Agent {
    id: number;
    name: string;
    icon: string;
    status: AgentStatus;
    task: string;
}

export interface ActivityLogEntry {
    id: string;
    timestamp: Date;
    agentId: number;
    agentName: string;
    agentIcon: string;
    message: string;
}

// KPI types
export interface KPIs {
    avgWaitTime: number; // minutes
    waitTimeReduction: number; // percentage
    rampUtilization: number; // percentage
    overtimeReduction: number; // percentage
    monthlySavings: number; // EUR
    trucksProcessed: number;
}

// Data Source
export interface DataSource {
    type: DataSourceType;
    status: 'connected' | 'disconnected' | 'syncing';
    lastSync: Date | null;
}

// Simulation types
export type SimulationScenario = 'traffic_jam_a8' | 'staff_absence' | 'early_arrival' | 'peak_monday';

export interface SimulationState {
    active: boolean;
    scenario: SimulationScenario | null;
    affectedTrucks: string[];
}

// Demo State (overall app state)
export interface DemoState {
    mode: OperatingMode;
    currentSite: Site | null;
    trucks: Truck[];
    docks: Dock[];
    recommendations: Recommendation[];
    agents: Agent[];
    activityLog: ActivityLogEntry[];
    kpis: KPIs;
    simulation: SimulationState;
    dataSources: DataSource[];
}
