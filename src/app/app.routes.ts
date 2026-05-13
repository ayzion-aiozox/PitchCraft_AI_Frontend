import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'landing',
    loadChildren: () => import('./features/landing/landing.routes').then(m => m.LANDING_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'product-lab',
    loadChildren: () =>
      import('./features/product-lab/product-lab.routes').then((m) => m.PRODUCT_LAB_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'ai',
    loadChildren: () => import('./features/ai-workspace/ai-workspace.routes').then((m) => m.AI_WORKSPACE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'ai-idea-lab',
    loadChildren: () => import('./features/ai-idea-lab/ai-idea-lab.routes').then((m) => m.AI_IDEA_LAB_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'persona-forge',
    loadChildren: () => import('./features/persona-forge/persona-forge.routes').then(m => m.PERSONA_FORGE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'prospect-hunter',
    loadChildren: () => import('./features/prospect-hunter/prospect-hunter.routes').then(m => m.PROSPECT_HUNTER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'strategies',
    loadChildren: () => import('./features/strategy-studio/strategy-studio.routes').then(m => m.STRATEGY_STUDIO_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'campaign-engine',
    loadChildren: () => import('./features/campaign-engine/campaign-engine.routes').then(m => m.CAMPAIGN_ENGINE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns',
    redirectTo: 'campaign-engine',
    pathMatch: 'full'
  },
  {
    path: 'intelligence-hub',
    loadChildren: () => import('./features/intelligence-hub/intelligence-hub.routes').then(m => m.INTELLIGENCE_HUB_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'analytics',
    redirectTo: 'intelligence-hub',
    pathMatch: 'full'
  },
  {
    path: 'integrations',
    loadChildren: () => import('./features/integrations/integrations.routes').then(m => m.INTEGRATIONS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];