import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import Shell from './components/layout/Shell';
import './styles/global.css';

const MarketAnalysis = lazy(() => import('./pages/MarketAnalysis'));
const CostAnalysis = lazy(() => import('./pages/CostAnalysis'));

render(() => (
  <Router root={Shell}>
    <Route path="/" component={MarketAnalysis} />
    <Route path="/costs" component={CostAnalysis} />
  </Router>
), document.getElementById('app')!);
