import { useTranslation } from 'react-i18next';
import { useKPIs } from '@/api/hooks/use-ramp-optimizer';
import { Timer, Clock, BarChart2, Euro, Truck } from 'lucide-react';
import type { ReactNode } from 'react';

interface KPICardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    sub: string;
}

function KPICard({ label, value, icon, color, sub }: KPICardProps) {
    return (
        <div className="p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl relative overflow-hidden glass-card min-w-0">
            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 text-slate-100 opacity-5 rotate-12">
                {icon}
            </div>
            <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1 truncate relative z-10">{label}</div>
            <div className="text-lg md:text-xl lg:text-2xl font-bold truncate relative z-10" style={{ color }}>{value}</div>
            <div className="text-[10px] md:text-xs text-slate-500 mt-1 truncate relative z-10">{sub}</div>
        </div>
    );
}

export function KPIRow() {
    const { t } = useTranslation();
    const { data: kpis, isLoading } = useKPIs();

    if (isLoading || !kpis) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl glass-card animate-pulse">
                        <div className="h-3 bg-slate-700 rounded w-16 md:w-20 mb-2" />
                        <div className="h-6 md:h-8 bg-slate-700 rounded w-12 md:w-16 mb-1" />
                        <div className="h-3 bg-slate-700 rounded w-20 md:w-24" />
                    </div>
                ))}
            </div>
        );
    }

    const kpiData = [
        {
            label: t('kpis.avgWaitTime'),
            value: `${kpis.avgWaitTime} ${t('kpis.avgWaitTimeUnit')}`,
            icon: <Timer size={80} strokeWidth={1.5} />,
            color: '#10b981',
            sub: t('kpis.avgWaitTimeSub', { percent: kpis.waitTimeReduction })
        },
        {
            label: t('kpis.overtime'),
            value: `-${kpis.overtimeReduction}%`,
            icon: <Clock size={80} strokeWidth={1.5} />,
            color: '#3b82f6',
            sub: t('kpis.overtimeSub')
        },
        {
            label: t('kpis.dockUtilization'),
            value: `${kpis.rampUtilization}%`,
            icon: <BarChart2 size={80} strokeWidth={1.5} />,
            color: '#8b5cf6',
            sub: t('kpis.dockUtilizationSub')
        },
        {
            label: t('kpis.monthlySavings'),
            value: `€${kpis.monthlySavings.toLocaleString('de-DE')}`,
            icon: <Euro size={80} strokeWidth={1.5} />,
            color: '#10b981',
            sub: t('kpis.monthlySavingsSub')
        },
        {
            label: t('kpis.trucksToday'),
            value: kpis.trucksProcessed,
            icon: <Truck size={80} strokeWidth={1.5} />,
            color: '#f59e0b',
            sub: t('kpis.trucksTodaySub')
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-6">
            {kpiData.map((kpi, i) => (
                <KPICard key={i} {...kpi} />
            ))}
        </div>
    );
}
