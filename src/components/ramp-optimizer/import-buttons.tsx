import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';

interface ImportButtonsProps {
    onExcelImport?: () => void;
    onManualEntry?: () => void;
}

export function ImportButtons({ onExcelImport, onManualEntry }: ImportButtonsProps) {
    const { t } = useTranslation();
    const { mode } = useDemoMode();

    // Only show in standalone mode
    if (mode !== 'standalone') {
        return null;
    }

    const handleExcelImport = () => {
        // Create a hidden file input and trigger it
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                // Simulate import success
                alert(`${t('import.importSuccess', { count: Math.floor(Math.random() * 20) + 5 })}`);
                onExcelImport?.();
            }
        };
        input.click();
    };

    const handleManualEntry = () => {
        // Simulate manual entry dialog
        alert(t('import.entryAdded'));
        onManualEntry?.();
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExcelImport}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
          bg-amber-500/10 text-amber-400 border border-amber-500/20 
          hover:bg-amber-500/20 transition-all"
            >
                {t('import.excelImport')}
            </button>

            <button
                onClick={handleManualEntry}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
          hover:bg-emerald-500/20 transition-all"
            >
                {t('import.manualEntry')}
            </button>
        </div>
    );
}
