import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTrucks } from '@/api/hooks/use-ramp-optimizer';
import { cn } from '@/lib/utils';
import type { Truck } from '@/types/ramp-optimizer';

function getDelayStyle(delay: number) {
    if (delay > 10) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: 'late' };
    if (delay < -10) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: 'early' };
    if (delay !== 0) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', text: delay > 0 ? 'late' : 'early' };
    return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: 'onTime' };
}

interface TruckRowProps {
    truck: Truck;
    onDragStart: (truckId: string) => void;
    isDragging: boolean;
}

function TruckRow({ truck, onDragStart, isDragging }: TruckRowProps) {
    const { t } = useTranslation();
    const delay = getDelayStyle(truck.delay);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', truck.id);
        // Store in window for cross-component communication
        (window as any).__draggedTruckId = truck.id;
        onDragStart(truck.id);
    };

    const handleDragEnd = () => {
        onDragStart('');
    };

    const getDelayText = () => {
        if (delay.text === 'onTime') return t('trucks.delay.onTime');
        if (delay.text === 'late') return t('trucks.delay.late', { minutes: truck.delay });
        return t('trucks.delay.early', { minutes: Math.abs(truck.delay) });
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={cn(
                "p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl cursor-grab active:cursor-grabbing transition-all hover:bg-slate-800/50",
                isDragging && "opacity-50 scale-[0.98]",
                truck.status === 'assigned' ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/50 border-slate-700/10"
            )}
            style={{
                border: `1px solid ${truck.status === 'assigned' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.1)'}`
            }}
        >
            {/* Mobile/Tablet: Stacked layout */}
            <div className="flex md:hidden flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-white text-sm truncate">{truck.id}</span>
                    <span className="text-xs text-slate-400 truncate">{truck.carrier}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-300 truncate">{truck.cargo} · {truck.weight}</span>
                    <span className="font-mono text-xs font-medium text-white shrink-0">ETA {truck.eta}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div
                        className="px-1.5 py-0.5 rounded text-[10px] text-center font-medium shrink-0"
                        style={{ background: delay.bg, color: delay.color }}
                    >
                        {getDelayText()}
                    </div>
                    <div
                        className="px-1.5 py-0.5 rounded text-[10px] text-center font-medium uppercase shrink-0"
                        style={{
                            background: truck.status === 'assigned' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: truck.status === 'assigned' ? '#10b981' : '#f59e0b'
                        }}
                    >
                        {t(`trucks.status.${truck.status}`)}
                    </div>
                    {truck.dockId && (
                        <span className="text-[10px] text-slate-400">→ Dock {truck.dockId}</span>
                    )}
                </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden md:grid md:grid-cols-7 gap-2 lg:gap-4 items-center text-sm min-w-0">
                <div className="font-mono font-semibold text-white truncate">{truck.id}</div>
                <div className="text-slate-400 truncate">{truck.carrier}</div>
                <div className="text-slate-300 truncate">{truck.cargo} · {truck.weight}</div>
                <div className="font-mono font-medium text-white shrink-0">ETA {truck.eta}</div>
                <div
                    className="px-2 py-1 rounded text-xs text-center font-medium truncate"
                    style={{ background: delay.bg, color: delay.color }}
                >
                    {getDelayText()}
                </div>
                <div
                    className="px-2 py-1 rounded text-xs text-center font-medium uppercase truncate"
                    style={{
                        background: truck.status === 'assigned' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: truck.status === 'assigned' ? '#10b981' : '#f59e0b'
                    }}
                >
                    {t(`trucks.status.${truck.status}`)}
                </div>
                <div className="text-xs text-slate-400 truncate">
                    {truck.dockId ? `→ Dock ${truck.dockId}` : '—'}
                </div>
            </div>
        </div>
    );
}

export function TruckList() {
    const { t } = useTranslation();
    const { data: trucks, isLoading } = useTrucks();
    const [draggingTruckId, setDraggingTruckId] = useState<string>('');

    const handleDragStart = (truckId: string) => {
        setDraggingTruckId(truckId);
    };

    if (isLoading) {
        return (
            <div className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl glass-card">
                <div className="text-base md:text-lg font-semibold text-white mb-3 md:mb-5">{t('trucks.title')}</div>
                <div className="flex flex-col gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-3 md:p-4 rounded-lg md:rounded-xl glass-dark animate-pulse h-12 md:h-16" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl glass-card">
            <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-5 flex items-center gap-2 min-w-0">
                <span className="shrink-0">🚛</span>
                <span className="truncate">{t('trucks.title')}</span>
                <span className="ml-auto text-[10px] md:text-xs text-slate-400 font-normal hidden sm:inline shrink-0">{t('trucks.dragDropHint')}</span>
            </h2>
            <div className="flex flex-col gap-2">
                {trucks?.map(truck => (
                    <TruckRow
                        key={truck.id}
                        truck={truck}
                        onDragStart={handleDragStart}
                        isDragging={draggingTruckId === truck.id}
                    />
                ))}
            </div>
        </div>
    );
}
