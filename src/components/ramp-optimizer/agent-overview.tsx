import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAgents } from '@/api/hooks/use-ramp-optimizer';
import { useDemoMode } from '@/contexts/demo-mode-context';
import { cn } from '@/lib/utils';
import type { Agent } from '@/types/ramp-optimizer';

interface AgentCardProps {
    agent: Agent;
    isActive: boolean;
}

function AgentCard({ agent, isActive }: AgentCardProps) {
    const { t } = useTranslation();
    const { mode } = useDemoMode();

    // Map agent IDs to translation keys
    const getAgentName = () => {
        const keys = ['data', 'analysis', 'prediction', 'recommendation', 'learning', 'orchestrator'];
        const key = keys[agent.id - 1];
        return t(`agents.names.${key}`);
    };

    // Adjust task description based on mode and ID
    const getTaskDescription = () => {
        const keys = ['data', 'analysis', 'prediction', 'recommendation', 'learning', 'orchestrator'];
        const key = keys[agent.id - 1];

        if (agent.id === 1) {
            return mode === 'integrated'
                ? t('agents.tasks.data')
                : t('agents.tasks.dataStandalone');
        }
        return t(`agents.tasks.${key}`);
    };

    const getStatusColor = () => {
        switch (agent.status) {
            case 'active': return '#10b981';
            case 'processing': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <div
            className={cn(
                "p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl transition-all min-w-0",
                isActive && "scale-[1.02]"
            )}
            style={{
                background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${isActive ? 'rgba(139, 92, 246, 0.5)' : 'rgba(148, 163, 184, 0.1)'}`,
            }}
        >
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 min-w-0">
                <span className="text-lg md:text-2xl shrink-0">{agent.icon}</span>
                <div className="min-w-0">
                    <div className="font-medium text-white text-xs md:text-sm truncate">{getAgentName()}</div>
                    <div className="text-[10px] md:text-xs flex items-center gap-1">
                        <span
                            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0"
                            style={{ background: getStatusColor() }}
                        />
                        <span className="text-slate-400 truncate">
                            {t(`agents.status.${agent.status}`)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="text-[10px] md:text-xs text-slate-400 line-clamp-2 min-h-[2.5em]">{getTaskDescription()}</div>
        </div>
    );
}

export function AgentOverview() {
    const { t } = useTranslation();
    const { showAgents, setShowAgents } = useDemoMode();
    const { data: agents } = useAgents();
    const [activeAgentIndex, setActiveAgentIndex] = useState(2); // Start with prediction agent

    // Rotate active agent for visual effect
    useEffect(() => {
        if (!showAgents) return;

        const interval = setInterval(() => {
            setActiveAgentIndex(prev => (prev + 1) % 6);
        }, 3000);

        return () => clearInterval(interval);
    }, [showAgents]);

    return (
        <>
            <button
                onClick={() => setShowAgents(!showAgents)}
                className="p-3 md:p-4 rounded-lg md:rounded-xl text-slate-300 flex items-center justify-center gap-2 transition-all hover:bg-slate-700/30 text-xs md:text-sm"
                style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
            >
                <span>🤖</span>
                <span className="truncate">{showAgents ? t('agents.titleExpanded') : t('agents.title')}</span>
            </button>

            {showAgents && agents && (
                <div className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl glass-card animate-fade-in" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h3 className="text-white font-semibold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                        <span>🤖</span>
                        <span className="truncate">{t('agents.multiAgentSystem')}</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                        {agents.map((agent, index) => (
                            <AgentCard
                                key={agent.id}
                                agent={agent}
                                isActive={activeAgentIndex === index}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

// Active agent indicator for header
export function ActiveAgentIndicator() {
    const { t } = useTranslation();
    const { data: agents } = useAgents();
    const [activeIndex, setActiveIndex] = useState(2);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % 6);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const activeAgent = agents?.[activeIndex];

    if (!activeAgent) return null;

    const getAgentName = (id: number) => {
        const keys = ['data', 'analysis', 'prediction', 'recommendation', 'learning', 'orchestrator'];
        const key = keys[id - 1];
        return t(`agents.names.${key}`);
    };

    return (
        <div
            className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl min-w-0 w-[220px] lg:w-[260px]"
            style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)' }}
        >
            <span className="text-base md:text-lg shrink-0">{activeAgent.icon}</span>
            <div className="min-w-0 hidden md:block flex-1">
                <div className="text-[10px] md:text-xs text-slate-400">{t('agents.activeAgent')}</div>
                <div className="text-xs md:text-sm font-medium text-purple-300 truncate">{getAgentName(activeAgent.id)}</div>
            </div>
        </div>
    );
}
