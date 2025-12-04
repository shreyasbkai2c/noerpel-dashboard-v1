import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            <button
                onClick={() => toggleLanguage('de')}
                className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-all",
                    i18n.language.startsWith('de')
                        ? "bg-slate-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-300"
                )}
            >
                DE
            </button>
            <button
                onClick={() => toggleLanguage('en')}
                className={cn(
                    "px-2 py-1 rounded text-xs font-medium transition-all",
                    i18n.language.startsWith('en')
                        ? "bg-slate-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-300"
                )}
            >
                EN
            </button>
        </div>
    );
}
