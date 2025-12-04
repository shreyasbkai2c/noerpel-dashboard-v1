import { useTranslation } from 'react-i18next';
import { useDemoMode } from '@/contexts/demo-mode-context';
import logoImage from '@/components/AI2ConnectLogoMitrand.jpg';
import {
    ModeToggle,
    ModeDescription,
    SiteSelector,
    KPIRow,
    DockGrid,
    TruckList,
    RecommendationPanel,
    AgentOverview,
    AgentActivityFeed,
    ROIComparison,
    SimulationPanel,
    ActiveAgentIndicator,
    ImportButtons,
    LanguageSwitcher,
} from '@/components/ramp-optimizer';

function DashboardHeader() {
    const { t } = useTranslation();
    const { currentSite } = useDemoMode();

    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <header className="flex flex-wrap justify-between items-center mb-4 p-3 md:p-4 lg:p-5 rounded-2xl glass-panel gap-3">
            <div className="flex items-center gap-4 min-w-0">
                {/* Logo - P0 Update */}
                <img
                    src={logoImage}
                    alt="AI2Connect Logo"
                    className="h-12 md:h-14 w-auto rounded-lg object-contain bg-white/10"
                />

                <div className="min-w-0">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight truncate">{t('app.title')}</h1>
                    <p className="text-xs md:text-sm text-slate-400 truncate">
                        {currentSite.name} · {t('app.subtitle')} · {currentSite.dockCount} Docks
                    </p>
                </div>

                {/* Language Switcher - P0 Update */}
                <div className="ml-2">
                    <LanguageSwitcher />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4 lg:gap-6">
                {/* Mode Toggle - P0 CRITICAL */}
                <ModeToggle />

                {/* Site Selector - P1 */}
                <SiteSelector />

                {/* Import Buttons (only in standalone mode) */}
                <ImportButtons />

                {/* Active Agent Indicator - hide on small screens */}
                <div className="hidden lg:block">
                    <ActiveAgentIndicator />
                </div>

                <div className="text-right shrink-0">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {timeString}
                    </div>
                    <div className="text-xs text-slate-400">{dateString}</div>
                </div>
            </div>
        </header>
    );
}

function DashboardFooter() {
    const { t } = useTranslation();

    return (
        <footer
            className="mt-4 p-3 md:p-4 rounded-xl flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2"
            style={{ background: 'rgba(26, 39, 68, 0.4)' }}
        >
            <div className="truncate max-w-full text-center md:text-left">{t('app.footer.version')}</div>
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center">
                <span className="whitespace-nowrap">🔗 {t('app.footer.compatible')}</span>
                <span className="whitespace-nowrap">📖 {t('app.footer.readOnly')}</span>
                <span className="whitespace-nowrap">🔒 {t('app.footer.privacy')}</span>
            </div>
        </footer>
    );
}

export function RampOptimizerView() {
    const { showAiPanel, setShowAiPanel } = useDemoMode();
    const { t } = useTranslation();

    return (
        <div
            className="min-h-screen h-screen overflow-auto p-2 md:p-3 lg:p-4 gradient-bg"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
            {/* Header */}
            <DashboardHeader />

            {/* Mode Description */}
            <div className="mb-3 px-1">
                <ModeDescription />
            </div>

            {/* KPIs */}
            <KPIRow />

            {/* Main Content Grid */}
            <div className={`grid gap-3 md:gap-4 lg:gap-6 ${showAiPanel ? 'lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]' : 'grid-cols-1'}`}>
                {/* Left Column - Main Content */}
                <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-w-0">
                    {/* Docks */}
                    <DockGrid />

                    {/* Trucks */}
                    <TruckList />

                    {/* Simulation Panel - P1 */}
                    <SimulationPanel />

                    {/* Agent Activity Feed - P1 */}
                    <AgentActivityFeed />

                    {/* Agent Overview */}
                    <AgentOverview />

                    {/* ROI Comparison */}
                    <ROIComparison />
                </div>

                {/* Right Column - AI Panel */}
                {showAiPanel && (
                    <div className="hidden lg:block">
                        <RecommendationPanel />
                    </div>
                )}
            </div>

            {/* Mobile AI Panel Button */}
            <button
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="lg:hidden fixed bottom-4 right-4 px-4 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 gradient-primary z-50"
                style={{ boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)' }}
            >
                <span className="text-xl">🧠</span>
                <span className="hidden sm:inline">{t('recommendations.title')}</span>
            </button>

            {/* Toggle AI Panel Button (when hidden on desktop) */}
            {!showAiPanel && (
                <button
                    onClick={() => setShowAiPanel(true)}
                    className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 px-4 py-3 rounded-xl font-semibold text-white items-center gap-2 transition-all hover:scale-105 gradient-primary"
                    style={{ boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)' }}
                >
                    <span className="text-xl">🧠</span>
                    {t('recommendations.title')}
                </button>
            )}

            {/* Footer */}
            <DashboardFooter />
        </div>
    );
}
