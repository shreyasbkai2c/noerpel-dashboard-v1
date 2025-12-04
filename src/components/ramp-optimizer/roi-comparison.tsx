import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';

export function ROIComparison() {
    const { t } = useTranslation();
    const { showComparison, setShowComparison } = useDemoMode();

    const todayMetrics = [
        { label: t('comparison.metrics.avgWaitTime'), value: '35 Min', color: '#ef4444' },
        { label: t('comparison.metrics.overtime'), value: t('comparison.values.regular'), color: '#ef4444' },
        { label: t('comparison.metrics.dockAssignment'), value: t('comparison.values.gutFeeling'), color: '#f59e0b' },
        { label: t('comparison.metrics.dataDriven'), value: t('comparison.values.rarely'), color: '#ef4444' },
        { label: t('comparison.metrics.monthlyCost'), value: '+ €21.836', color: '#ef4444' },
    ];

    const withAiMetrics = [
        { label: t('comparison.metrics.avgWaitTime'), value: '20 Min (-43%)', color: '#10b981' },
        { label: t('comparison.metrics.overtime'), value: '-20%', color: '#10b981' },
        { label: t('comparison.metrics.dockAssignment'), value: t('comparison.values.aiOptimized'), color: '#10b981' },
        { label: t('comparison.metrics.dataDriven'), value: t('comparison.values.inSeconds'), color: '#10b981' },
        { label: t('comparison.metrics.monthlySavings'), value: '€21.836', color: '#10b981' },
    ];

    return (
        <>
            <button
                onClick={() => setShowComparison(!showComparison)}
                className="p-3 md:p-4 rounded-lg md:rounded-xl text-slate-300 flex items-center justify-center gap-2 transition-all hover:bg-slate-700/30 text-xs md:text-sm"
                style={{ background: 'rgba(26, 39, 68, 0.4)', border: '1px solid rgba(148, 163, 184, 0.1)' }}
            >
                <span>📊</span>
                <span className="truncate">{showComparison ? t('comparison.hide') : t('comparison.title')}</span>
            </button>

            {showComparison && (
                <div className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl glass-card animate-fade-in">
                    <h3 className="text-white font-semibold mb-3 md:mb-5 text-sm md:text-base truncate">{t('comparison.monthlyRoi')}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                        {/* Today (Manual) */}
                        <div
                            className="p-3 md:p-4 lg:p-5 rounded-lg md:rounded-xl"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                        >
                            <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-2 md:mb-4">
                                {t('comparison.today')}
                            </div>
                            {todayMetrics.map((metric, i) => (
                                <div key={i} className="flex justify-between py-1.5 md:py-2 border-b border-slate-700/30 last:border-0 gap-2 min-w-0">
                                    <span className="text-slate-300 text-[10px] md:text-xs lg:text-sm truncate">{metric.label}</span>
                                    <span className="font-semibold text-[10px] md:text-xs lg:text-sm shrink-0" style={{ color: metric.color }}>{metric.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* With AI */}
                        <div
                            className="p-3 md:p-4 lg:p-5 rounded-lg md:rounded-xl"
                            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                        >
                            <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-2 md:mb-4">
                                {t('comparison.withAi')}
                            </div>
                            {withAiMetrics.map((metric, i) => (
                                <div key={i} className="flex justify-between py-1.5 md:py-2 border-b border-slate-700/30 last:border-0 gap-2 min-w-0">
                                    <span className="text-slate-300 text-[10px] md:text-xs lg:text-sm truncate">{metric.label}</span>
                                    <span className="font-semibold text-[10px] md:text-xs lg:text-sm shrink-0" style={{ color: metric.color }}>{metric.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Yearly Potential */}
                    <div
                        className="mt-3 md:mt-4 p-3 md:p-4 rounded-lg md:rounded-xl text-center"
                        style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                    >
                        <div className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-400">€262.032 / Jahr</div>
                        <div className="text-[10px] md:text-xs lg:text-sm text-slate-400">{t('comparison.yearlyPotential')}</div>
                    </div>
                </div>
            )}
        </>
    );
}
