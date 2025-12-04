import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DemoModeProvider } from '@/contexts/demo-mode-context';
import { RampOptimizerView } from '@/views/ramp-optimizer-view';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoModeProvider>
        <RampOptimizerView />
      </DemoModeProvider>
    </QueryClientProvider>
  );
}

export default App;
