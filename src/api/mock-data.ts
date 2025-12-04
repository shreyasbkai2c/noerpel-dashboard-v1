import type {
    Truck,
    Dock,
    Recommendation,
    Agent,
    KPIs,
    ActivityLogEntry
} from '@/types/ramp-optimizer';

// Initial trucks data
export const initialTrucks: Truck[] = [
    { id: 'LKW-4821', carrier: 'Schenker', eta: '08:15', scheduledSlot: '08:30', cargo: 'Paletten', weight: '18t', status: 'approaching', delay: 0, dockId: null },
    { id: 'LKW-7293', carrier: 'DHL Freight', eta: '08:45', scheduledSlot: '08:30', cargo: 'Stückgut', weight: '12t', status: 'approaching', delay: 15, dockId: null },
    { id: 'LKW-1056', carrier: 'Dachser', eta: '09:00', scheduledSlot: '09:00', cargo: 'Container', weight: '22t', status: 'approaching', delay: 0, dockId: null },
    { id: 'LKW-3847', carrier: 'Noerpel', eta: '09:10', scheduledSlot: '09:30', cargo: 'Paletten', weight: '15t', status: 'approaching', delay: -20, dockId: null },
    { id: 'LKW-9182', carrier: 'Kühne+Nagel', eta: '09:25', scheduledSlot: '09:30', cargo: 'Kühlware', weight: '16t', status: 'approaching', delay: -5, dockId: null },
    { id: 'LKW-6574', carrier: 'DB Schenker', eta: '09:55', scheduledSlot: '10:00', cargo: 'Stückgut', weight: '14t', status: 'approaching', delay: -5, dockId: null },
];

// Initial docks data (8 docks for Ulm)
export const initialDocks: Dock[] = [
    { id: 1, name: 'Dock 1', type: 'standard', status: 'free', currentTruck: null, queue: 0, avgTime: 28, historicalPerf: '+12%' },
    { id: 2, name: 'Dock 2', type: 'standard', status: 'free', currentTruck: null, queue: 1, avgTime: 22, historicalPerf: '+23%' },
    { id: 3, name: 'Dock 3', type: 'heavy', status: 'occupied', currentTruck: 'LKW-2201', queue: 2, avgTime: 35, historicalPerf: '-5%' },
    { id: 4, name: 'Dock 4', type: 'cooling', status: 'free', currentTruck: null, queue: 0, avgTime: 25, historicalPerf: '+18%' },
    { id: 5, name: 'Dock 5', type: 'standard', status: 'maintenance', currentTruck: null, queue: 0, avgTime: null, historicalPerf: null },
    { id: 6, name: 'Dock 6', type: 'standard', status: 'free', currentTruck: null, queue: 1, avgTime: 30, historicalPerf: '+8%' },
    { id: 7, name: 'Dock 7', type: 'standard', status: 'free', currentTruck: null, queue: 0, avgTime: 21, historicalPerf: '+23%' },
    { id: 8, name: 'Dock 8', type: 'heavy', status: 'occupied', currentTruck: 'LKW-1199', queue: 1, avgTime: 32, historicalPerf: '+4%' },
];

// AI Recommendations
export const initialRecommendations: Recommendation[] = [
    {
        id: 1,
        type: 'dock',
        priority: 'high',
        title: 'Optimale Dock-Zuweisung',
        description: 'LKW-3847 (Noerpel, 15t Paletten) → Dock 7, 14:00 Uhr',
        historicalNote: 'Historisch 23% schneller als Durchschnitt',
        confidence: 86,
        impact: { waitTime: [10, 15], savings: [320, 360], co2: [12, 18] },
        truckId: 'LKW-3847',
        dockId: 7,
    },
    {
        id: 2,
        type: 'dock',
        priority: 'high',
        title: 'Kühlware priorisieren',
        description: 'LKW-9182 (Kühne+Nagel, Kühlware) → Dock 4 (Kühldock)',
        historicalNote: 'Kühldock reduziert Standzeit um 18%',
        confidence: 92,
        impact: { waitTime: [5, 10], savings: [200, 240], co2: [8, 12] },
        truckId: 'LKW-9182',
        dockId: 4,
    },
    {
        id: 3,
        type: 'dock',
        priority: 'medium',
        title: 'Dock 2 nutzen',
        description: 'LKW-4821 (Schenker) → Dock 2 statt Dock 6',
        historicalNote: 'Basierend auf 847 historischen Abfertigungen',
        confidence: 78,
        impact: { waitTime: [4, 8], savings: [160, 200], co2: [5, 9] },
        truckId: 'LKW-4821',
        dockId: 2,
    },
    {
        id: 4,
        type: 'alert',
        priority: 'medium',
        title: 'Engpass-Warnung 09:25',
        description: '3 LKW treffen gleichzeitig ein. Dock 3 Warteschlange kritisch.',
        historicalNote: 'Ähnliche Situation führte gestern zu +22 Min Wartezeit',
        confidence: 81,
        impact: { waitTime: [12, 18], savings: [380, 440], co2: [15, 22] },
        truckId: null,
        dockId: null,
    },
];

// 6 AI Agents
export const aiAgents: Agent[] = [
    { id: 1, name: 'Daten-Agent', icon: '📥', status: 'active', task: 'Sammelt Daten aus CargoClix & LFS V8' },
    { id: 2, name: 'Analyse-Agent', icon: '🔍', status: 'active', task: 'Erkennt Muster in Echtzeit' },
    { id: 3, name: 'Vorhersage-Agent', icon: '🎯', status: 'processing', task: 'Berechnet optimale Zuweisungen' },
    { id: 4, name: 'Empfehlungs-Agent', icon: '💡', status: 'active', task: 'Gibt Handlungsempfehlungen' },
    { id: 5, name: 'Lern-Agent', icon: '🧠', status: 'idle', task: 'Verbessert System kontinuierlich' },
    { id: 6, name: 'Orchestrator', icon: '🎼', status: 'active', task: 'Koordiniert alle Agenten' },
];

// Initial KPIs (matching email numbers)
export const initialKPIs: KPIs = {
    avgWaitTime: 35,
    waitTimeReduction: 43,
    rampUtilization: 72,
    overtimeReduction: 20,
    monthlySavings: 21836,
    trucksProcessed: 47,
};

// Generate mock activity log entries
export function generateActivityLog(): ActivityLogEntry[] {
    const now = new Date();
    const entries: ActivityLogEntry[] = [
        {
            id: '1',
            timestamp: new Date(now.getTime() - 5000),
            agentId: 1,
            agentName: 'Daten-Agent',
            agentIcon: '📥',
            message: 'Neue ETA für LKW-7293 empfangen',
        },
        {
            id: '2',
            timestamp: new Date(now.getTime() - 3000),
            agentId: 2,
            agentName: 'Analyse-Agent',
            agentIcon: '🔍',
            message: 'Muster erkannt: 3 LKW-Cluster um 14:30',
        },
        {
            id: '3',
            timestamp: new Date(now.getTime() - 2000),
            agentId: 3,
            agentName: 'Vorhersage-Agent',
            agentIcon: '🎯',
            message: 'Engpass berechnet: Dock 3, +15 min',
        },
        {
            id: '4',
            timestamp: new Date(now.getTime() - 1000),
            agentId: 4,
            agentName: 'Empfehlungs-Agent',
            agentIcon: '💡',
            message: 'Neue Empfehlung generiert (Konfidenz 86%)',
        },
        {
            id: '5',
            timestamp: now,
            agentId: 6,
            agentName: 'Orchestrator',
            agentIcon: '🎼',
            message: 'Empfehlung an Dashboard gesendet',
        },
    ];

    return entries;
}

// Generate docks for a specific site
export function generateDocksForSite(dockCount: number): Dock[] {
    const docks: Dock[] = [];
    const types: Array<'standard' | 'heavy' | 'cooling'> = ['standard', 'standard', 'heavy', 'cooling', 'standard', 'standard', 'standard', 'heavy', 'standard', 'standard'];
    const statuses: Array<'free' | 'occupied' | 'maintenance'> = ['free', 'free', 'occupied', 'free', 'maintenance', 'free', 'free', 'occupied', 'free', 'free'];

    for (let i = 0; i < dockCount; i++) {
        const isFree = statuses[i % statuses.length] === 'free';
        docks.push({
            id: i + 1,
            name: `Dock ${i + 1}`,
            type: types[i % types.length],
            status: statuses[i % statuses.length],
            currentTruck: statuses[i % statuses.length] === 'occupied' ? `LKW-${1000 + i}` : null,
            queue: isFree ? Math.floor(Math.random() * 3) : 0,
            avgTime: statuses[i % statuses.length] !== 'maintenance' ? 20 + Math.floor(Math.random() * 15) : null,
            historicalPerf: statuses[i % statuses.length] !== 'maintenance' ? `+${5 + Math.floor(Math.random() * 20)}%` : null,
        });
    }

    return docks;
}
