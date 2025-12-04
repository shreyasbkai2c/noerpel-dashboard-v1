import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';
import type { SimulationScenario } from '@/types/ramp-optimizer';

interface ScenarioOption {
    id: SimulationScenario;
    icon: string;
    titleKey: string;
    descKey: string;
}

const scenarios: ScenarioOption[] = [
    { id: 'traffic_jam_a8', icon: '🚗', titleKey: 'trafficJamA8', descKey: 'trafficJamA8Desc' },
    { id: 'staff_absence', icon: '👥', titleKey: 'staffAbsence', descKey: 'staffAbsenceDesc' },
    { id: 'early_arrival', icon: '⏰', titleKey: 'earlyArrival', descKey: 'earlyArrivalDesc' },
    { id: 'peak_monday', icon: '📈', titleKey: 'peakMonday', descKey: 'peakMondayDesc' },
];

export function SimulationPanel() {
    const { t } = useTranslation();
    const { simulation, startSimulation, stopSimulation } = useDemoMode();
    const [showScenarios, setShowScenarios] = useState(false);

    const handleStartSimulation = (scenario: SimulationScenario) => {
        startSimulation(scenario);
        setShowScenarios(false);
    };

    if (simulation.active) {
        const activeScenario = scenarios.find(s => s.id === simulation.scenario);

        return (
            <div
                className="p-3 md:p-4 rounded-lg md:rounded-xl animate-fade-in"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
                <div className="flex items-center justify-between mb-2 md:mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg md:text-xl animate-pulse shrink-0">🚨</span>
                        <span className="text-white font-semibold text-xs md:text-sm truncate">
                            {t('simulation.title')}: {activeScenario?.icon} {t(`simulation.scenarios.${activeScenario?.titleKey}`)}
                        </span>
                    </div>
                    <button
                        onClick={stopSimulation}
                        className="px-2 md:px-3 py-1 rounded-md md:rounded-lg text-[10px] md:text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shrink-0"
                    >
                        {t('simulation.stop')}
                    </button>
                </div>

                <div className="text-[10px] md:text-xs lg:text-sm text-yellow-300 line-clamp-2">
                    {t('simulation.alert', {
                        scenario: t(`simulation.scenarios.${activeScenario?.titleKey}`),
                        count: simulation.affectedTrucks.length
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="w-full p-3 md:p-4 rounded-lg md:rounded-xl text-slate-300 flex items-center justify-center gap-2 transition-all hover:bg-slate-700/30 text-xs md:text-sm"
                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
            >
                <span className="truncate">{t('simulation.button')}</span>
            </button>

            {showScenarios && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 p-3 md:p-4 rounded-lg md:rounded-xl z-10 animate-fade-in"
                    style={{ background: 'rgba(26, 39, 68, 0.95)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                >
                    <div className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3">{t('simulation.title')}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {scenarios.map(scenario => (
                            <button
                                key={scenario.id}
                                onClick={() => handleStartSimulation(scenario.id)}
                                className="p-2 md:p-3 rounded-md md:rounded-lg text-left hover:bg-slate-700/50 transition-all"
                                style={{ border: '1px solid rgba(148, 163, 184, 0.1)' }}
                            >
                                <div className="flex items-center gap-2 mb-1 min-w-0">
                                    <span className="shrink-0">{scenario.icon}</span>
                                    <span className="text-xs md:text-sm font-medium text-white truncate">
                                        {t(`simulation.scenarios.${scenario.titleKey}`)}
                                    </span>
                                </div>
                                <div className="text-[10px] md:text-xs text-slate-400 line-clamp-2">
                                    {t(`simulation.scenarios.${scenario.descKey}`)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
