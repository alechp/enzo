import { render } from 'solid-js/web';
import { Router, Route, A, useLocation } from '@solidjs/router';
import { lazy, createEffect, type ParentProps } from 'solid-js';
import Shell from './components/layout/Shell';
import './styles/global.css';

const MarketAnalysis = lazy(() => import('./pages/MarketAnalysis'));
const CostAnalysis = lazy(() => import('./pages/CostAnalysis'));

function AppShell(props: ParentProps) {
  const location = useLocation();
  createEffect(() => {
    location.pathname;
    window.scrollTo(0, 0);
  });
  return <Shell>{props.children}</Shell>;
}

function NotFound() {
  return (
    <div class="py-20 text-center">
      <h1 class="font-display font-black text-[3rem] text-ink mb-4">404</h1>
      <p class="text-ink-dim mb-6">Page not found.</p>
      <A href="/" class="text-acid font-mono text-sm no-underline hover:underline">
        ← Market Analysis
      </A>
    </div>
  );
}

render(() => (
  <Router root={AppShell}>
    <Route path="/" component={MarketAnalysis} />
    <Route path="/costs" component={CostAnalysis} />
    <Route path="*" component={NotFound} />
  </Router>
), document.getElementById('app')!);
