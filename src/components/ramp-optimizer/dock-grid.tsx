import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocks, useAssignTruckToDock } from '@/api/hooks/use-ramp-optimizer';
import { useTrucks } from '@/api/hooks/use-ramp-optimizer';
import { cn } from '@/lib/utils';
import type { Dock, DockStatus } from '@/types/ramp-optimizer';

function getDockStatusStyle(status: DockStatus) {
    const styles = {
        free: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: 'free' },
        occupied: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: 'occupied' },
        reserved: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: 'reserved' },
        maintenance: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: 'maintenance' },
    };
    return styles[status];
}

function getDockTypeIcon(type: string) {
    switch (type) {
        case 'cooling': return '❄️';
        case 'heavy': return '🏋️';
        default: return '📦';
    }
}

interface DockCardProps {
    dock: Dock;
    onDrop: (dockId: number) => void;
    assignedTruck?: { id: string } | null;
}

function DockCard({ dock, onDrop, assignedTruck }: DockCardProps) {
    const { t } = useTranslation();
    const [isDragOver, setIsDragOver] = useState(false);
    const style = getDockStatusStyle(dock.status);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (dock.status === 'free') {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (dock.status === 'free') {
            onDrop(dock.id);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl transition-all flex flex-col min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px]",
                dock.status === 'free' && "cursor-pointer hover:brightness-110",
                isDragOver && "drop-target-active"
            )}
            style={{
                background: style.bg,
                border: `2px solid ${isDragOver ? '#3b82f6' : style.border}`,
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-2 md:mb-3 min-w-0">
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white text-sm sm:text-base md:text-lg truncate">{dock.name}</div>
                    <div
                        className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded inline-block font-semibold mt-1"
                        style={{ background: style.border, color: '#0c1222' }}
                    >
                        {t(`docks.status.${style.text}`)}
                    </div>
                </div>
                <div className="text-[10px] md:text-xs text-slate-400 shrink-0 ml-1">
                    {getDockTypeIcon(dock.type)}
                </div>
            </div>

            {/* Queue Visualization */}
            {dock.status !== 'maintenance' && (
                <div className="mb-2 md:mb-3">
                    <div className="text-[10px] md:text-xs text-slate-400 mb-1">{t('docks.queue')}</div>
                    <div className="flex gap-0.5 md:gap-1">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[10px] md:text-xs"
                                style={{
                                    background: i < dock.queue ? 'rgba(245, 158, 11, 0.4)' : 'rgba(100, 116, 139, 0.2)',
                                    color: i < dock.queue ? '#f59e0b' : '#475569'
                                }}
                            >
                                {i < dock.queue ? '🚛' : '·'}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Historical Performance */}
            {dock.historicalPerf && (
                <div className="mt-auto pt-2 border-t border-slate-700/30">
                    <div className="flex justify-between items-center gap-1 min-w-0">
                        <span className="text-[10px] md:text-xs text-slate-400 truncate">
                            {t('docks.avgTime', { time: dock.avgTime })}
                        </span>
                        <span
                            className="text-[10px] md:text-xs font-medium shrink-0"
                            style={{ color: dock.historicalPerf.startsWith('+') ? '#10b981' : '#ef4444' }}
                        >
                            {dock.historicalPerf}
                        </span>
                    </div>
                </div>
            )}

            {/* Current Truck */}
            {dock.currentTruck && (
                <div className="text-[10px] md:text-xs px-1.5 md:px-2 py-1 rounded bg-black/30 text-slate-300 mt-2 truncate">
                    {dock.currentTruck}
                </div>
            )}

            {/* Assigned Truck */}
            {assignedTruck && (
                <div
                    className="text-[10px] md:text-xs px-1.5 md:px-2 py-1 rounded mt-2 truncate"
                    style={{ background: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}
                >
                    ✓ {assignedTruck.id}
                </div>
            )}
        </div>
    );
}

export function DockGrid() {
    const { t } = useTranslation();
    const { data: docks, isLoading } = useDocks();
    const { data: trucks } = useTrucks();
    const assignMutation = useAssignTruckToDock();

    // Store the dragged truck ID globally for cross-component communication
    const handleDrop = (dockId: number) => {
        // Get the dragged truck from a data attribute or state
        const truckId = (window as any).__draggedTruckId;
        if (truckId) {
            assignMutation.mutate({ truckId, dockId });
            (window as any).__draggedTruckId = null;
        }
    };

    if (isLoading) {
        return (
            <div className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl glass-card">
                <div className="text-base md:text-lg font-semibold text-white mb-3 md:mb-5">{t('docks.title')}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="p-3 md:p-4 rounded-lg md:rounded-xl glass-dark animate-pulse min-h-[120px] md:min-h-[160px] lg:min-h-[180px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl glass-card">
            <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-5 flex items-center gap-2 min-w-0">
                <span className="shrink-0">🏭</span>
                <span className="truncate">{t('docks.title')}</span>
                <span className="ml-auto text-[10px] md:text-xs text-slate-400 font-normal hidden sm:inline shrink-0">{t('docks.dropZoneHint')}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                {docks?.map(dock => {
                    const assignedTruck = trucks?.find(t => t.dockId === dock.id);
                    return (
                        <DockCard
                            key={dock.id}
                            dock={dock}
                            onDrop={handleDrop}
                            assignedTruck={assignedTruck}
                        />
                    );
                })}
            </div>
        </div>
    );
}
