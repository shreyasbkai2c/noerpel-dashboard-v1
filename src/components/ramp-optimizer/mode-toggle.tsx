import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';
import { cn } from '@/lib/utils';

export function ModeToggle() {
    const { t } = useTranslation();
    const { mode, setMode } = useDemoMode();

    return (
        <div className="flex items-center gap-0.5 md:gap-1 p-0.5 md:p-1 rounded-lg md:rounded-xl bg-slate-800/50 border border-slate-700/50">
            <button
                onClick={() => setMode('integrated')}
                className={cn(
                    "flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all",
                    mode === 'integrated'
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                )}
            >
                <span>🔗</span>
                <span className="hidden sm:inline truncate">{t('mode.integrated')}</span>
            </button>

            <button
                onClick={() => setMode('standalone')}
                className={cn(
                    "flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all",
                    mode === 'standalone'
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                )}
            >
                <span>📦</span>
                <span className="hidden sm:inline truncate">{t('mode.standalone')}</span>
            </button>
        </div>
    );
}

export function ModeDescription() {
    const { t } = useTranslation();
    const { mode } = useDemoMode();

    if (mode === 'integrated') {
        return (
            <div className="text-[10px] md:text-xs text-slate-400 max-w-full lg:max-w-2xl line-clamp-2">
                {t('mode.integratedDescription')}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <div className="text-[10px] md:text-xs text-slate-400 max-w-full lg:max-w-2xl line-clamp-2">
                {t('mode.standaloneDescription')}
            </div>
            <div className="text-[10px] md:text-xs text-purple-400 font-medium line-clamp-1">
                ✨ {t('mode.standaloneHighlight')}
            </div>
        </div>
    );
}
