import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
    OperatingMode,
    Site,
    SimulationScenario,
    SimulationState
} from '@/types/ramp-optimizer';

// Available sites for the demo
export const DEMO_SITES: Site[] = [
    {
        id: 'ulm',
        name: 'Ulm',
        city: 'Ulm',
        dockCount: 8,
        hasTimeSlotSystem: true,
        systems: ['cargoclix', 'lfs_v8'],
    },
    {
        id: 'giengen',
        name: 'Giengen',
        city: 'Giengen',
        dockCount: 6,
        hasTimeSlotSystem: true,
        systems: ['cargoclix', 'lfs_v8'],
    },
    {
        id: 'heidenheim',
        name: 'Heidenheim',
        city: 'Heidenheim',
        dockCount: 10,
        hasTimeSlotSystem: false,
        systems: [],
    },
    {
        id: 'stuttgart',
        name: 'Stuttgart',
        city: 'Stuttgart',
        dockCount: 4,
        hasTimeSlotSystem: false,
        systems: [],
    },
];

interface DemoModeContextValue {
    // Mode
    mode: OperatingMode;
    setMode: (mode: OperatingMode) => void;

    // Site
    currentSite: Site;
    setCurrentSite: (site: Site) => void;
    availableSites: Site[];

    // Simulation
    simulation: SimulationState;
    startSimulation: (scenario: SimulationScenario) => void;
    stopSimulation: () => void;

    // UI State
    showAiPanel: boolean;
    setShowAiPanel: (show: boolean) => void;
    showAgents: boolean;
    setShowAgents: (show: boolean) => void;
    showComparison: boolean;
    setShowComparison: (show: boolean) => void;
    showActivityFeed: boolean;
    setShowActivityFeed: (show: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
    // Default to Ulm (integrated site)
    const [currentSite, setCurrentSiteInternal] = useState<Site>(DEMO_SITES[0]);
    const [mode, setModeInternal] = useState<OperatingMode>('integrated');

    const [simulation, setSimulation] = useState<SimulationState>({
        active: false,
        scenario: null,
        affectedTrucks: [],
    });

    // UI State
    const [showAiPanel, setShowAiPanel] = useState(true);
    const [showAgents, setShowAgents] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showActivityFeed, setShowActivityFeed] = useState(false);

    // When site changes, auto-set mode based on whether it has time slot system
    const setCurrentSite = useCallback((site: Site) => {
        setCurrentSiteInternal(site);
        setModeInternal(site.hasTimeSlotSystem ? 'integrated' : 'standalone');
    }, []);

    const setMode = useCallback((newMode: OperatingMode) => {
        setModeInternal(newMode);
    }, []);

    const startSimulation = useCallback((scenario: SimulationScenario) => {
        // Define affected trucks based on scenario
        let affectedTrucks: string[] = [];

        switch (scenario) {
            case 'traffic_jam_a8':
                affectedTrucks = ['LKW-4821', 'LKW-7293', 'LKW-1056'];
                break;
            case 'staff_absence':
                affectedTrucks = [];
                break;
            case 'early_arrival':
                affectedTrucks = ['LKW-3847'];
                break;
            case 'peak_monday':
                affectedTrucks = ['LKW-4821', 'LKW-7293', 'LKW-1056', 'LKW-3847', 'LKW-9182'];
                break;
        }

        setSimulation({
            active: true,
            scenario,
            affectedTrucks,
        });
    }, []);

    const stopSimulation = useCallback(() => {
        setSimulation({
            active: false,
            scenario: null,
            affectedTrucks: [],
        });
    }, []);

    const value = useMemo<DemoModeContextValue>(() => ({
        mode,
        setMode,
        currentSite,
        setCurrentSite,
        availableSites: DEMO_SITES,
        simulation,
        startSimulation,
        stopSimulation,
        showAiPanel,
        setShowAiPanel,
        showAgents,
        setShowAgents,
        showComparison,
        setShowComparison,
        showActivityFeed,
        setShowActivityFeed,
    }), [
        mode,
        setMode,
        currentSite,
        setCurrentSite,
        simulation,
        startSimulation,
        stopSimulation,
        showAiPanel,
        showAgents,
        showComparison,
        showActivityFeed,
    ]);

    return (
        <DemoModeContext.Provider value={value}>
            {children}
        </DemoModeContext.Provider>
    );
}

export function useDemoMode() {
    const context = useContext(DemoModeContext);
    if (!context) {
        throw new Error('useDemoMode must be used within a DemoModeProvider');
    }
    return context;
}
