import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private menuItems = new BehaviorSubject<MenuItem[]>([]);
  menuItems$ = this.menuItems.asObservable();

  private bottomItems = new BehaviorSubject<MenuItem[]>([]);
  bottomItems$ = this.bottomItems.asObservable();

  constructor(private http: HttpClient) {
    this.setMenuItems(this.getDefaultMenu());
    this.loadMenuItems();
  }

  private loadMenuItems(): void {
    this.http
      .get<MenuItem[]>('assets/menu-config.json')
      .pipe(
        timeout(8000),
        catchError(() => of(this.getDefaultMenu()))
      )
      .subscribe((items) => {
        this.setMenuItems(items);
      });
  }

  private setMenuItems(items: MenuItem[]): void {
    const main = items.filter(i => i.id !== 'settings');
    const bottom = items.filter(i => i.id === 'settings');
    this.menuItems.next(main);
    this.bottomItems.next(bottom);
  }

  private getDefaultMenu(): MenuItem[] {
    return [
      { id: 'dashboard', label: 'Command Center', route: '/dashboard', icon: 'LayoutDashboard', position: 'main' },
      { id: 'ai', label: 'AI Workspace', route: '/ai', icon: 'Sparkles', position: 'main' },
      { id: 'ai-idea-lab', label: 'AI Idea Lab', route: '/ai-idea-lab', icon: 'Lightbulb', position: 'main' },
      { id: 'product-lab', label: 'Product Lab', route: '/product-lab', icon: 'FlaskConical', position: 'main' },
      { id: 'personas', label: 'Persona Forge', route: '/persona-forge', icon: 'Users', position: 'main' },
      { id: 'prospects', label: 'Prospect Hunter', route: '/prospect-hunter', icon: 'Target', position: 'main' },
      { id: 'strategies', label: 'Strategy Studio', route: '/strategies', icon: 'Monitor', position: 'main' },
      { id: 'campaigns', label: 'Campaign Engine', route: '/campaign-engine', icon: 'Rocket', position: 'main' },
      { id: 'analytics', label: 'Intelligence Hub', route: '/intelligence-hub', icon: 'BarChart3', position: 'main' },
      { id: 'integrations', label: 'Integration Station', route: '/integrations', icon: 'Puzzle', position: 'main' },
      { id: 'settings', label: 'Workspace Settings', route: '/settings', icon: 'Settings', position: 'bottom' }
    ];
  }

  // Call this to update menu items dynamically
  updateMenuItems(items: MenuItem[]): void {
    this.setMenuItems(items);
  }
}