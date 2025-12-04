import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDemoMode } from '@/contexts/demo-mode-context';
import {
    initialTrucks,
    initialDocks,
    initialRecommendations,
    aiAgents,
    initialKPIs,
    generateActivityLog,
    generateDocksForSite,
} from '@/api/mock-data';
import type {
    Truck,
    Dock,
    Recommendation,
    Agent,
    KPIs,
    ActivityLogEntry
} from '@/types/ramp-optimizer';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ Trucks ============
export function useTrucks() {
    const { currentSite, simulation } = useDemoMode();

    return useQuery({
        queryKey: ['trucks', currentSite.id, simulation.active, simulation.scenario],
        queryFn: async (): Promise<Truck[]> => {
            await delay(100); // Simulate network delay

            let trucks = [...initialTrucks];

            // Apply simulation effects
            if (simulation.active && simulation.scenario === 'traffic_jam_a8') {
                trucks = trucks.map(truck => {
                    if (simulation.affectedTrucks.includes(truck.id)) {
                        return { ...truck, delay: truck.delay + 25 };
                    }
                    return truck;
                });
            }

            if (simulation.active && simulation.scenario === 'early_arrival') {
                trucks = trucks.map(truck => {
                    if (simulation.affectedTrucks.includes(truck.id)) {
                        return { ...truck, delay: -45 };
                    }
                    return truck;
                });
            }

            return trucks;
        },
        staleTime: 5000,
    });
}

// ============ Docks ============
export function useDocks() {
    const { currentSite } = useDemoMode();

    return useQuery({
        queryKey: ['docks', currentSite.id],
        queryFn: async (): Promise<Dock[]> => {
            await delay(100);

            // Use site-specific dock count
            if (currentSite.id === 'ulm') {
                return initialDocks;
            }

            return generateDocksForSite(currentSite.dockCount);
        },
        staleTime: 5000,
    });
}

// ============ Recommendations ============
export function useRecommendations() {
    const { currentSite, simulation } = useDemoMode();

    return useQuery({
        queryKey: ['recommendations', currentSite.id, simulation.active, simulation.scenario],
        queryFn: async (): Promise<Recommendation[]> => {
            await delay(100);

            let recommendations = [...initialRecommendations];

            // Add simulation-specific recommendations
            if (simulation.active && simulation.scenario === 'traffic_jam_a8') {
                recommendations = [
                    {
                        id: 100,
                        type: 'alert',
                        priority: 'high',
                        title: '🚨 Stau A8 - Verzögerung',
                        description: '3 LKW melden +25 Min Verzögerung wegen Stau auf der A8',
                        historicalNote: 'System empfiehlt Dock-Neuplanung für optimalen Durchsatz',
                        confidence: 94,
                        impact: { waitTime: [25, 35], savings: [800, 900], co2: [30, 40] },
                        truckId: null,
                        dockId: null,
                    },
                    ...recommendations,
                ];
            }

            return recommendations;
        },
        staleTime: 2000,
    });
}

// ============ Agents ============
export function useAgents() {
    return useQuery({
        queryKey: ['agents'],
        queryFn: async (): Promise<Agent[]> => {
            await delay(50);
            return aiAgents;
        },
        staleTime: 30000,
    });
}

// ============ KPIs ============
export function useKPIs() {
    const { currentSite } = useDemoMode();

    return useQuery({
        queryKey: ['kpis', currentSite.id],
        queryFn: async (): Promise<KPIs> => {
            await delay(100);
            return initialKPIs;
        },
        staleTime: 5000,
    });
}

// ============ Activity Log ============
export function useActivityLog() {
    return useQuery({
        queryKey: ['activityLog'],
        queryFn: async (): Promise<ActivityLogEntry[]> => {
            await delay(50);
            return generateActivityLog();
        },
        staleTime: 1000,
        refetchInterval: 3000, // Refresh every 3 seconds to simulate live feed
    });
}

// ============ Mutations ============

interface ApplyRecommendationParams {
    recommendation: Recommendation;
}

export function useApplyRecommendation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ recommendation }: ApplyRecommendationParams) => {
            await delay(200);

            // Simulate updating the truck and dock state
            return {
                success: true,
                recommendation,
            };
        },
        onSuccess: ({ recommendation }) => {
            // Update trucks cache
            queryClient.setQueryData<Truck[]>(['trucks'], (oldTrucks) => {
                if (!oldTrucks) return oldTrucks;
                return oldTrucks.map(truck =>
                    truck.id === recommendation.truckId
                        ? { ...truck, dockId: recommendation.dockId, status: 'assigned' as const }
                        : truck
                );
            });

            // Update docks cache
            queryClient.setQueryData<Dock[]>(['docks'], (oldDocks) => {
                if (!oldDocks) return oldDocks;
                return oldDocks.map(dock =>
                    dock.id === recommendation.dockId
                        ? { ...dock, status: 'reserved' as const, queue: dock.queue + 1 }
                        : dock
                );
            });

            // Update KPIs cache
            queryClient.setQueryData<KPIs>(['kpis'], (oldKpis) => {
                if (!oldKpis) return oldKpis;
                return {
                    ...oldKpis,
                    avgWaitTime: Math.max(18, oldKpis.avgWaitTime - 4),
                    rampUtilization: Math.min(89, oldKpis.rampUtilization + 3),
                };
            });

            // Remove the applied recommendation
            queryClient.setQueryData<Recommendation[]>(['recommendations'], (oldRecs) => {
                if (!oldRecs) return oldRecs;
                return oldRecs.filter(r => r.id !== recommendation.id);
            });
        },
    });
}

interface AssignTruckToDockParams {
    truckId: string;
    dockId: number;
}

export function useAssignTruckToDock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ truckId, dockId }: AssignTruckToDockParams) => {
            await delay(150);
            return { truckId, dockId };
        },
        onSuccess: ({ truckId, dockId }) => {
            // Update trucks cache
            queryClient.setQueryData<Truck[]>(['trucks'], (oldTrucks) => {
                if (!oldTrucks) return oldTrucks;
                return oldTrucks.map(truck =>
                    truck.id === truckId
                        ? { ...truck, dockId, status: 'assigned' as const }
                        : truck
                );
            });

            // Update docks cache
            queryClient.setQueryData<Dock[]>(['docks'], (oldDocks) => {
                if (!oldDocks) return oldDocks;
                return oldDocks.map(dock =>
                    dock.id === dockId
                        ? { ...dock, status: 'reserved' as const }
                        : dock
                );
            });

            // Update KPIs
            queryClient.setQueryData<KPIs>(['kpis'], (oldKpis) => {
                if (!oldKpis) return oldKpis;
                return {
                    ...oldKpis,
                    avgWaitTime: Math.max(18, oldKpis.avgWaitTime - 2),
                    rampUtilization: Math.min(92, oldKpis.rampUtilization + 2),
                };
            });
        },
    });
}
