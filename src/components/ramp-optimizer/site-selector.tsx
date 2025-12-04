import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';
import type { Site } from '@/types/ramp-optimizer';

export function SiteSelector() {
    const { currentSite, setCurrentSite, availableSites } = useDemoMode();

    return (
        <div className="relative">
            <select
                value={currentSite.id}
                onChange={(e) => {
                    const site = availableSites.find(s => s.id === e.target.value);
                    if (site) setCurrentSite(site);
                }}
                className="appearance-none bg-slate-800/50 border border-slate-700/50 rounded-lg md:rounded-xl 
                    px-2 md:px-4 py-1.5 md:py-2 pr-7 md:pr-10 text-white text-xs md:text-sm font-medium cursor-pointer
                    hover:bg-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    max-w-[120px] sm:max-w-[200px] md:max-w-none truncate"
            >
                {availableSites.map((site) => (
                    <option key={site.id} value={site.id} className="bg-slate-800">
                        {site.name} ({site.hasTimeSlotSystem ? 'Integrated' : 'Standalone'})
                    </option>
                ))}
            </select>

            {/* Dropdown Arrow */}
            <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

interface SiteInfoProps {
    site: Site;
    compact?: boolean;
}

export function SiteInfo({ site, compact = false }: SiteInfoProps) {
    const { t } = useTranslation();

    if (compact) {
        return (
            <span className="text-xs md:text-sm text-slate-400 truncate">
                {site.name} · {site.dockCount} {t('sites.docks')}
            </span>
        );
    }

    return (
        <div className="flex items-center gap-2 min-w-0">
            <span className="text-base md:text-lg shrink-0">📍</span>
            <div className="min-w-0">
                <div className="font-medium text-white text-sm md:text-base truncate">{site.name}</div>
                <div className="text-[10px] md:text-xs text-slate-400 truncate">
                    {site.hasTimeSlotSystem
                        ? `CargoClix + LFS V8 · ${site.dockCount} ${t('sites.docks')}`
                        : `Standalone · ${site.dockCount} ${t('sites.docks')}`
                    }
                </div>
            </div>
        </div>
    );
}
