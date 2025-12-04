import { useTranslation } from 'react-i18next';
import { useActivityLog } from '@/api/hooks/use-ramp-optimizer';
import { useDemoMode } from '@/contexts/demo-mode-context';
import type { ActivityLogEntry } from '@/types/ramp-optimizer';

export function AgentActivityFeed() {
    const { t } = useTranslation();
    const { showActivityFeed, setShowActivityFeed } = useDemoMode();
    const { data: activityLog } = useActivityLog();

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getAgentName = (id: number) => {
        const keys = ['data', 'analysis', 'prediction', 'recommendation', 'learning', 'orchestrator'];
        const key = keys[id - 1];
        return t(`agents.names.${key}`);
    };

    const getMessage = (entry: ActivityLogEntry) => {
        switch (entry.id) {
            case '1':
                return t('activityFeed.messages.newEta', { truck: 'LKW-7293' });
            case '2':
                return t('activityFeed.messages.patternDetected', { count: 3, time: '14:30' });
            case '3':
                return t('activityFeed.messages.bottleneckCalculated', { dock: 3, minutes: 15 });
            case '4':
                return t('activityFeed.messages.recommendationGenerated', { confidence: 86 });
            case '5':
                return t('activityFeed.messages.recommendationSent');
            default:
                return entry.message;
        }
    };

    return (
        <>
            <button
                onClick={() => setShowActivityFeed(!showActivityFeed)}
                className="p-3 md:p-4 rounded-lg md:rounded-xl text-slate-300 flex items-center justify-center gap-2 transition-all hover:bg-slate-700/30 text-xs md:text-sm"
                style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
            >
                <span>🤖</span>
                <span className="truncate">{showActivityFeed ? t('activityFeed.title') : t('activityFeed.title')}</span>
            </button>

            {showActivityFeed && (
                <div
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl glass-card animate-fade-in"
                    style={{ border: '1px solid rgba(59, 130, 246, 0.2)' }}
                >
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                        <h3 className="text-white font-semibold flex items-center gap-2 text-sm md:text-base">
                            <span>🤖</span> {t('activityFeed.title')}
                        </h3>
                        <span
                            className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1 shrink-0"
                        >
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {t('activityFeed.liveFeed')}
                        </span>
                    </div>

                    <div className="space-y-1.5 md:space-y-2 max-h-[160px] md:max-h-[200px] overflow-y-auto">
                        {activityLog?.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-start gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg bg-slate-900/50 animate-slide-in min-w-0"
                            >
                                <span className="text-[10px] md:text-xs text-slate-500 font-mono whitespace-nowrap shrink-0">
                                    {formatTime(entry.timestamp)}
                                </span>
                                <span className="text-base md:text-lg shrink-0">{entry.agentIcon}</span>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] md:text-xs font-medium text-blue-400 truncate block">{getAgentName(entry.agentId)}</span>
                                    <p className="text-[10px] md:text-xs text-slate-300 truncate">{getMessage(entry)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
