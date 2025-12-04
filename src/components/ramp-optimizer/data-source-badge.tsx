import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';
import type { SystemType, DataSourceType } from '@/types/ramp-optimizer';

interface DataSourceBadgeProps {
    type: DataSourceType | SystemType;
    showLive?: boolean;
}

const badgeStyles: Record<DataSourceType | SystemType, { bg: string; text: string }> = {
    cargoclix: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    lfs_v8: { bg: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa' },
    manual: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399' },
    excel_import: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
};

export function DataSourceBadge({ type, showLive = false }: DataSourceBadgeProps) {
    const { t } = useTranslation();

    const style = badgeStyles[type];
    const labels: Record<DataSourceType | SystemType, string> = {
        cargoclix: t('dataSource.cargoclix'),
        lfs_v8: t('dataSource.lfsV8'),
        manual: t('dataSource.manual'),
        excel_import: t('dataSource.excelImport'),
    };

    return (
        <div className="flex items-center gap-2">
            <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ background: style.bg, color: style.text }}
            >
                {labels[type]}
            </span>
            {showLive && (
                <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">{t('recommendations.live')}</span>
                </>
            )}
        </div>
    );
}

export function DataSourceBadges() {
    const { t } = useTranslation();
    const { mode, currentSite } = useDemoMode();

    return (
        <div className="p-3 rounded-xl bg-slate-900/50">
            <div className="text-xs text-slate-400 mb-2">{t('recommendations.dataSources')}</div>
            <div className="flex flex-wrap gap-2 items-center">
                {mode === 'integrated' && currentSite.systems.length > 0 ? (
                    <>
                        {currentSite.systems.map((system, index) => (
                            <DataSourceBadge
                                key={system}
                                type={system}
                                showLive={index === currentSite.systems.length - 1}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        <DataSourceBadge type="manual" />
                        <DataSourceBadge type="excel_import" showLive />
                    </>
                )}
            </div>
        </div>
    );
}
