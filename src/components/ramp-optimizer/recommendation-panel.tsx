import { useTranslation } from 'react-i18next';
import { useRecommendations, useApplyRecommendation } from '@/api/hooks/use-ramp-optimizer';
import { DataSourceBadges } from './data-source-badge';
import { cn } from '@/lib/utils';
import type { Recommendation } from '@/types/ramp-optimizer';

function getConfidenceColor(confidence: number): string {
    if (confidence >= 85) return '#10b981';
    if (confidence >= 70) return '#f59e0b';
    return '#ef4444';
}

interface RecommendationCardProps {
    recommendation: Recommendation;
    onApply: (rec: Recommendation) => void;
    isApplying?: boolean;
}

function RecommendationCard({ recommendation, onApply, isApplying }: RecommendationCardProps) {
    const { t } = useTranslation();
    const confidenceColor = getConfidenceColor(recommendation.confidence);

    // Use translation keys for mock data if available
    const title = recommendation.id <= 4 ? t(`recommendations.mock.${recommendation.id}.title`) : recommendation.title;
    const description = recommendation.id <= 4 ? t(`recommendations.mock.${recommendation.id}.description`) : recommendation.description;
    const historicalNote = recommendation.id <= 4 ? t(`recommendations.mock.${recommendation.id}.historicalNote`) : recommendation.historicalNote;

    return (
        <div
            className="p-3 md:p-4 rounded-lg md:rounded-xl bg-slate-900/60 animate-fade-in"
            style={{
                border: `1px solid ${recommendation.priority === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}
        >
            {/* Header with priority and confidence */}
            <div className="flex items-start justify-between mb-2 gap-2 min-w-0">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                        className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded font-semibold shrink-0"
                        style={{
                            background: recommendation.priority === 'high' ? '#ef4444' : '#f59e0b',
                            color: '#0c1222'
                        }}
                    >
                        {t(`recommendations.priority.${recommendation.priority}`)}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-white truncate">{title}</span>
                </div>

                {/* Confidence Score */}
                <div className="flex items-center gap-1 shrink-0">
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full overflow-hidden bg-slate-700/50">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${recommendation.confidence}%`,
                                background: confidenceColor
                            }}
                        />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold" style={{ color: confidenceColor }}>
                        {recommendation.confidence}%
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-[10px] md:text-xs text-slate-300 mb-2 line-clamp-2">{description}</p>

            {/* Historical Note - P0 Feature */}
            <p className="text-[10px] md:text-xs text-purple-300 mb-2 md:mb-3 italic flex items-start gap-1">
                <span className="shrink-0">📈</span>
                <span className="line-clamp-2">{historicalNote}</span>
            </p>

            {/* Impact Metrics */}
            {recommendation.impact.waitTime[0] !== 0 && (
                <div className="flex flex-wrap gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                        <span>⏱️</span>
                        {t('recommendations.impact.waitTime', { min: recommendation.impact.waitTime[0], max: recommendation.impact.waitTime[1] })}
                    </span>
                    <span className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                        <span>💰</span>
                        {t('recommendations.impact.savings', { min: recommendation.impact.savings[0], max: recommendation.impact.savings[1] })}
                    </span>
                    <span className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                        <span>🌱</span>
                        {t('recommendations.impact.co2', { min: recommendation.impact.co2[0], max: recommendation.impact.co2[1] })}
                    </span>
                </div>
            )}

            {/* Apply Button */}
            {recommendation.truckId && (
                <button
                    onClick={() => onApply(recommendation)}
                    disabled={isApplying}
                    className={cn(
                        "w-full py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-semibold text-white transition-all",
                        isApplying
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90"
                    )}
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                    {isApplying ? t('common.loading') : t('recommendations.apply')}
                </button>
            )}
        </div>
    );
}

export function RecommendationPanel() {
    const { t } = useTranslation();
    const { data: recommendations, isLoading, error } = useRecommendations();
    const applyMutation = useApplyRecommendation();

    const handleApply = (recommendation: Recommendation) => {
        applyMutation.mutate({ recommendation });
    };

    const handleApplyAll = () => {
        recommendations?.filter(r => r.truckId).forEach((rec, i) => {
            setTimeout(() => handleApply(rec), i * 600);
        });
    };

    return (
        <div
            className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl h-fit lg:sticky lg:top-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
            style={{
                background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 min-w-0">
                <span className="text-2xl md:text-3xl shrink-0">🧠</span>
                <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-white truncate">{t('recommendations.title')}</h3>
                    <p className="text-[10px] md:text-xs text-slate-400 truncate">{t('recommendations.subtitle')}</p>
                </div>
            </div>

            {/* Data Sources */}
            <div className="mb-4 md:mb-6">
                <DataSourceBadges />
            </div>

            {/* Recommendations List */}
            <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
                {isLoading && (
                    <div className="text-slate-400 text-sm text-center py-4">
                        {t('common.loading')}
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-sm text-center py-4">
                        {t('common.error')}
                    </div>
                )}

                {recommendations?.map(rec => (
                    <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onApply={handleApply}
                        isApplying={applyMutation.isPending}
                    />
                ))}
            </div>

            {/* Apply All Button */}
            <div
                className="p-3 md:p-4 rounded-lg md:rounded-xl"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
                <div className="text-[10px] md:text-xs text-slate-400 mb-2">{t('recommendations.dispatcher')}</div>
                <button
                    onClick={handleApplyAll}
                    disabled={applyMutation.isPending || !recommendations?.some(r => r.truckId)}
                    className="w-full py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                    {t('recommendations.applyAll')}
                </button>
                <p className="text-[10px] md:text-xs text-slate-500 mt-2 text-center">
                    {t('recommendations.fullControl')}
                </p>
            </div>
        </div>
    );
}
